/**
 * moyasar-frontend-snippet.js
 * ----------------------------
 * Reference implementation of the browser-side half of the payment flow.
 * checkout.jsx imports the two functions below instead of re-implementing
 * the Moyasar calls inline, so the tokenization logic lives in one place.
 *
 * Card numbers go straight from the browser to MOYASAR using your
 * PUBLISHABLE key — they never pass through your own backend.
 */

// Set this to your deployed backend's public URL once it's live, e.g.
// "https://api.your-domain.com". Left as localhost for local development.
export const API_BASE_URL = "http://localhost:4000";

// Safe to expose publicly — this is the publishable key, not the secret one.
export const MOYASAR_PUBLISHABLE_KEY = "YOUR_MOYASAR_PUBLISHABLE_KEY_HERE";

/**
 * Step 1: tokenize the card in the browser (never touches our backend).
 */
export async function tokenizeCard({ name, number, cvc, month, year }) {
  const response = await fetch("https://api.moyasar.com/v1/tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa(`${MOYASAR_PUBLISHABLE_KEY}:`),
    },
    body: JSON.stringify({
      name,
      number: number.replace(/\s+/g, ""),
      cvc,
      month,
      year,
    }),
  });

  const token = await response.json();
  if (!response.ok) {
    throw new Error(token.message || "Card tokenization failed");
  }
  return token; // { id, ... }
}

/**
 * Step 2: send the resulting token to OUR backend, which charges it
 * with the secret key. Returns either a paid/failed status, or a
 * transactionUrl to redirect to for 3-D Secure verification.
 */
export async function chargeToken({ tokenId, amountSAR, description, name, email }) {
  const response = await fetch(`${API_BASE_URL}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: tokenId,
      amountSAR,
      description,
      name,
      email,
      method: "creditcard",
    }),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Payment failed");
  }
  return result; // { id, status, transactionUrl }
}

/**
 * Full flow used by the "ادفع الآن" button in checkout.jsx.
 */
export async function payWithCard(cardFields, order) {
  const token = await tokenizeCard(cardFields);
  const result = await chargeToken({ tokenId: token.id, ...order });

  if (result.transactionUrl) {
    // Card requires 3-D Secure — send the shopper there, Moyasar redirects
    // back to CALLBACK_URL on the backend, which then redirects to
    // `${FRONTEND_URL}/checkout?status=success|failed&id=...`
    window.location.href = result.transactionUrl;
    return { pending: true };
  }

  return { pending: false, status: result.status, id: result.id };
}

/**
 * Reads the ?status=success|failed&id=... query params checkout.jsx
 * should look for on mount, to handle the 3-D Secure redirect coming back.
 */
export function readPaymentRedirectResult() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");
  const id = params.get("id");
  if (!status) return null;
  return { status, id };
}
