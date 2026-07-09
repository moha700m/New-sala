/**
 * Agent Souq — Moyasar payment backend (production-ready version)
 * -----------------------------------------------------------------
 * Card numbers never touch this server. The browser tokenizes the
 * card via Moyasar's Tokens API (using the PUBLISHABLE key) and only
 * sends the resulting token id here. This server then charges that
 * token using the SECRET key, which must never reach the browser.
 *
 * Requires Node.js 18+ (for global fetch).
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { v4: uuid } = require("uuid");
const path = require("path");
const {
  insertPayment,
  updatePaymentStatusByMoyasarId,
  listPayments,
} = require("./db");

const app = express();

const {
  MOYASAR_SECRET_KEY,
  MOYASAR_WEBHOOK_SECRET,
  CALLBACK_URL,
  FRONTEND_URL = "http://localhost:5173",
  ADMIN_API_KEY,
  PORT = 4000,
  NODE_ENV = "development",
} = process.env;

if (!MOYASAR_SECRET_KEY) {
  console.warn("⚠️  MOYASAR_SECRET_KEY is not set — copy .env.example to .env and fill it in.");
}
if (!MOYASAR_WEBHOOK_SECRET) {
  console.warn("⚠️  MOYASAR_WEBHOOK_SECRET is not set — webhook requests cannot be verified until you set this.");
}

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Serves /.well-known/apple-developer-merchantid-domain-association
// Put the real file Apple/Moyasar gives you inside the `public/.well-known` folder.
app.use(express.static(path.join(__dirname, "public")));

const authHeader = "Basic " + Buffer.from(`${MOYASAR_SECRET_KEY}:`).toString("base64");
const MOYASAR_API = "https://api.moyasar.com/v1";

/**
 * Small helper: every route that talks to Moyasar goes through here so
 * errors and non-2xx responses are handled the same way everywhere.
 */
async function moyasarFetch(pathname, options = {}) {
  const response = await fetch(`${MOYASAR_API}${pathname}`, {
    ...options,
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
}

/**
 * POST /api/payments
 * Body: { token, amountSAR, description, name, email, method }
 * `token` comes from Moyasar's Tokens API, called from the browser
 * with the PUBLISHABLE key (see moyasar-frontend-snippet.js).
 */
app.post("/api/payments", async (req, res) => {
  const { token, amountSAR, description, name, email, method } = req.body;

  if (!token || !amountSAR) {
    return res.status(400).json({ error: "token and amountSAR are required" });
  }

  const amountHalalas = Math.round(amountSAR * 100);
  const internalId = uuid();

  try {
    const { ok, status, data: payment } = await moyasarFetch("/payments", {
      method: "POST",
      body: JSON.stringify({
        amount: amountHalalas,
        currency: "SAR",
        description: description || "Agent Souq subscription",
        callback_url: CALLBACK_URL,
        source: { type: "token", token, name: name || "Agent Souq Customer" },
      }),
    });

    // Record the attempt regardless of outcome — failed charges matter for support/audits too.
    insertPayment({
      id: internalId,
      moyasarId: payment.id || null,
      status: payment.status || "failed",
      amountHalalas,
      description,
      customerName: name,
      customerEmail: email,
      method: method || "creditcard",
      rawResponse: payment,
    });

    if (!ok) {
      return res.status(status).json({ error: payment.message || "Payment failed", details: payment });
    }

    res.json({
      internalId,
      id: payment.id,
      status: payment.status,
      transactionUrl: payment.source?.transaction_url || null,
    });
  } catch (err) {
    console.error("Moyasar payment error:", err);
    insertPayment({
      id: internalId,
      moyasarId: null,
      status: "failed",
      amountHalalas,
      description,
      customerName: name,
      customerEmail: email,
      method: method || "creditcard",
      rawResponse: { error: String(err) },
    });
    res.status(502).json({ error: "Could not reach Moyasar" });
  }
});

/**
 * GET /api/payments/:id
 * Re-checks the authoritative status with Moyasar (never trust a cached
 * value for anything money-related) and syncs our local record.
 */
app.get("/api/payments/:id", async (req, res) => {
  try {
    const { status, data: payment } = await moyasarFetch(`/payments/${req.params.id}`);
    if (payment?.id) {
      updatePaymentStatusByMoyasarId(payment.id, payment.status, payment);
    }
    res.status(status).json(payment);
  } catch (err) {
    res.status(502).json({ error: "Could not reach Moyasar" });
  }
});

/**
 * GET /api/payments/callback
 * Moyasar redirects the shopper's browser here after 3-D Secure.
 * We re-check the real status server-side, update our DB, then hand
 * the shopper back to the actual checkout UI with a plain status flag.
 */
app.get("/api/payments/callback", async (req, res) => {
  const { id } = req.query;
  if (!id) return res.redirect(`${FRONTEND_URL}/checkout?status=error`);

  try {
    const { data: payment } = await moyasarFetch(`/payments/${id}`);
    if (payment?.id) {
      updatePaymentStatusByMoyasarId(payment.id, payment.status, payment);
    }
    const ok = payment.status === "paid";
    res.redirect(`${FRONTEND_URL}/checkout?status=${ok ? "success" : "failed"}&id=${id}`);
  } catch {
    res.redirect(`${FRONTEND_URL}/checkout?status=error`);
  }
});

/**
 * POST /api/webhook
 * Configure this exact URL in the Moyasar dashboard, along with a
 * secret token — Moyasar echoes that token back in the payload so
 * you can confirm the request really came from Moyasar and not
 * someone hitting this endpoint directly.
 */
app.post("/api/webhook", express.json(), (req, res) => {
  const incomingSecret = req.body?.secret_token || req.headers["x-moyasar-secret"];

  if (!MOYASAR_WEBHOOK_SECRET || incomingSecret !== MOYASAR_WEBHOOK_SECRET) {
    console.warn("Webhook rejected: secret token mismatch");
    return res.status(401).json({ error: "invalid webhook secret" });
  }

  const event = req.body;
  const payment = event?.data;

  if (payment?.id && payment?.status) {
    updatePaymentStatusByMoyasarId(payment.id, payment.status, payment);
    console.log(`Webhook: payment ${payment.id} → ${payment.status}`);
  }

  res.sendStatus(200);
});

/**
 * GET /api/admin/payments
 * Minimal protected listing endpoint so you (or a dashboard) can see
 * recent transactions. Protected by a single static API key for now —
 * swap for real auth before giving anyone else access to it.
 */
app.get("/api/admin/payments", (req, res) => {
  if (!ADMIN_API_KEY || req.headers["x-admin-key"] !== ADMIN_API_KEY) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const rows = listPayments({ limit: Number(req.query.limit) || 50 });
  res.json(rows.map((r) => ({ ...r, raw_response: undefined })));
});

// ─── Demo Chat API ───────────────────────────────────────────────────────────
const { generateResponse, EMPLOYEE_KNOWLEDGE } = require("./demo-engine");

/**
 * GET /api/demo/employees
 * Returns list of all available AI employees for the marketplace.
 */
app.get("/api/demo/employees", (req, res) => {
  const employees = Object.entries(EMPLOYEE_KNOWLEDGE).map(([id, emp]) => ({
    id,
    name: emp.name,
    role: emp.role,
  }));
  res.json(employees);
});

/**
 * POST /api/demo/chat
 * Body: { employeeId, messages: [{role, content}], lang }
 * Response: Server-Sent Events (SSE) stream of text chunks.
 *
 * INTEGRATION POINT: Replace mock responses in demo-engine.js with
 * real AI (OpenAI, Anthropic, Gemini, OpenRouter) without changing this route.
 */
app.post("/api/demo/chat", async (req, res) => {
  const { employeeId = "sales-employee", messages = [], lang = "ar" } = req.body;

  // Validate message limit (max 10 messages per session)
  const userMessages = messages.filter(m => m.role === "user");
  if (userMessages.length > 10) {
    return res.status(429).json({ error: "demo_limit_reached", message: "Demo limit reached" });
  }

  // Set up SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  try {
    for await (const chunk of generateResponse(employeeId, messages, lang)) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
  } catch (err) {
    console.error("Demo chat error:", err);
    res.write(`data: ${JSON.stringify({ error: "Failed to generate response" })}\n\n`);
  } finally {
    res.end();
  }
});


/**
 * POST /api/payments/stcpay
 * Body: { mobile, amountSAR, description, name, email }
 * Initiates STC Pay payment via Moyasar — returns transactionUrl for OTP redirect
 */
app.post("/api/payments/stcpay", async (req, res) => {
  const { mobile, amountSAR, description, name, email } = req.body;
  if (!mobile || !amountSAR) {
    return res.status(400).json({ error: "mobile and amountSAR are required" });
  }
  const amountHalalas = Math.round(amountSAR * 100);
  const internalId = uuid();
  try {
    const { ok, status, data: payment } = await moyasarFetch("/payments", {
      method: "POST",
      body: JSON.stringify({
        amount: amountHalalas,
        currency: "SAR",
        description: description || "Agent Souq subscription",
        callback_url: CALLBACK_URL,
        source: { type: "stcpay", mobile },
      }),
    });
    insertPayment({
      id: internalId,
      moyasarId: payment.id || null,
      status: payment.status || "failed",
      amountHalalas,
      description,
      customerName: name,
      customerEmail: email,
      method: "stcpay",
      rawResponse: payment,
    });
    if (!ok) {
      return res.status(status).json({ error: payment.message || "STC Pay failed", details: payment });
    }
    res.json({
      internalId,
      id: payment.id,
      status: payment.status,
      transactionUrl: payment.source?.transaction_url || null,
    });
  } catch (err) {
    console.error("STC Pay error:", err);
    res.status(502).json({ error: "Could not reach Moyasar" });
  }
});

app.get("/health", (req, res) => res.json({ ok: true, env: NODE_ENV }));

app.listen(PORT, () => {
  console.log(`Agent Souq payment backend running on port ${PORT} (${NODE_ENV})`);
});
