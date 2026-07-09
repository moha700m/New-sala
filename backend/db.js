/**
 * db.js — SQLite storage for payment records.
 *
 * Using SQLite (via better-sqlite3) because Agent Souq's payment
 * volume doesn't need a separate DB server yet — it's a single file
 * on disk, trivial to back up, and fast enough for this workload.
 * Swap this file for a Postgres/MySQL client later without touching
 * server.js if you outgrow it — the exported functions are the contract.
 */

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "data", "payments.db");

// Make sure the data/ folder exists before SQLite tries to create the file in it.
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS payments (
    id            TEXT PRIMARY KEY,      -- our own internal id (uuid)
    moyasar_id    TEXT UNIQUE,           -- id Moyasar assigns to the payment
    status        TEXT NOT NULL,         -- initiated | paid | failed | authorized | refunded | voided
    amount_halalas INTEGER NOT NULL,
    currency      TEXT NOT NULL DEFAULT 'SAR',
    description   TEXT,
    customer_name TEXT,
    customer_email TEXT,
    method        TEXT,                  -- creditcard | applepay | mada
    raw_response  TEXT,                  -- last full JSON payload from Moyasar, for audits/debugging
    created_at    TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_payments_moyasar_id ON payments(moyasar_id);
  CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
`);

function insertPayment({ id, moyasarId, status, amountHalalas, currency, description, customerName, customerEmail, method, rawResponse }) {
  db.prepare(`
    INSERT INTO payments (id, moyasar_id, status, amount_halalas, currency, description, customer_name, customer_email, method, raw_response)
    VALUES (@id, @moyasarId, @status, @amountHalalas, @currency, @description, @customerName, @customerEmail, @method, @rawResponse)
  `).run({
    id,
    moyasarId: moyasarId || null,
    status,
    amountHalalas,
    currency: currency || "SAR",
    description: description || null,
    customerName: customerName || null,
    customerEmail: customerEmail || null,
    method: method || null,
    rawResponse: rawResponse ? JSON.stringify(rawResponse) : null,
  });
}

function updatePaymentStatusByMoyasarId(moyasarId, status, rawResponse) {
  db.prepare(`
    UPDATE payments
    SET status = @status,
        raw_response = @rawResponse,
        updated_at = datetime('now')
    WHERE moyasar_id = @moyasarId
  `).run({
    moyasarId,
    status,
    rawResponse: rawResponse ? JSON.stringify(rawResponse) : null,
  });
}

function getPaymentByMoyasarId(moyasarId) {
  return db.prepare(`SELECT * FROM payments WHERE moyasar_id = ?`).get(moyasarId);
}

function getPaymentById(id) {
  return db.prepare(`SELECT * FROM payments WHERE id = ?`).get(id);
}

function listPayments({ limit = 50, offset = 0 } = {}) {
  return db.prepare(`SELECT * FROM payments ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(limit, offset);
}

module.exports = {
  db,
  insertPayment,
  updatePaymentStatusByMoyasarId,
  getPaymentByMoyasarId,
  getPaymentById,
  listPayments,
};
