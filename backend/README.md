# Agent Souq — Moyasar Payment Backend (Production)

Full payment flow, end to end:

```
checkout.jsx (browser)
   │  1. tokenizes card via Moyasar Tokens API (publishable key)
   ▼
Moyasar
   │  2. returns a token id (never the raw card)
   ▼
this backend  →  POST /api/payments  (secret key charges the token)
   │  3. saves the attempt to SQLite regardless of outcome
   ▼
Moyasar  →  paid / failed / needs 3-D Secure (transactionUrl)
   │
   ├─ 3-D Secure? → browser redirected to transactionUrl → back to
   │                /api/payments/callback → backend re-checks status,
   │                updates DB → redirects to checkout.jsx?status=...
   │
   └─ Webhook (async, independent of the browser) → /api/webhook →
      verifies secret_token → updates DB
```

## 1. Local setup

```bash
cd backend
cp .env.example .env
# paste your Moyasar test keys + a random MOYASAR_WEBHOOK_SECRET + ADMIN_API_KEY into .env
npm install
npm start
```

Requires **Node.js 18+**. First run creates `data/payments.db` automatically.

Check it's alive: `curl http://localhost:4000/health`

## 2. Point checkout.jsx at it

In `checkout.jsx`, update the two constants near the top:

```js
const API_BASE_URL = "http://localhost:4000";           // → your deployed URL later
const MOYASAR_PUBLISHABLE_KEY = "pk_test_xxxxxxxxxxxx";  // → your real publishable key
```

The card form now really tokenizes with Moyasar and really charges through
this backend — there is no mock step left in that file.

## 3. Test cards (test mode only)

| Card number          | Result             |
|-----------------------|--------------------|
| 4111 1111 1111 1111  | Successful payment |
| 4000 0000 0000 0002  | Declined           |

Any future expiry and any 3-digit CVV work in test mode.

## 4. Configure the webhook in Moyasar's dashboard

- URL: `https://api.your-domain.com/api/webhook`
- Secret token: the same value you put in `MOYASAR_WEBHOOK_SECRET`

This is your safety net — it fires even if the shopper closes the tab
mid-payment, so your database stays correct.

## 5. Check stored payments

```bash
curl -H "x-admin-key: <your ADMIN_API_KEY>" http://localhost:4000/api/admin/payments
```

## 6. Deploy to your AWS EC2 VPS

You already have an EC2 instance (eu-north-1) from your other projects —
these steps assume Ubuntu on that same box, run over SSH.

**Option A — Docker (recommended, isolates native deps like better-sqlite3):**

```bash
# on the VPS
sudo apt update && sudo apt install -y docker.io docker-compose-plugin
git clone https://github.com/moha700m/New-sala.git agent-souq && cd agent-souq/backend
cp .env.example .env   # edit with real keys + NODE_ENV=production
sudo docker compose up -d --build
```

**Option B — PM2 directly on the VPS:**

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs build-essential python3
npm install -g pm2
git clone https://github.com/moha700m/New-sala.git agent-souq && cd agent-souq/backend
cp .env.example .env   # edit with real keys + NODE_ENV=production
npm install
pm2 start ecosystem.config.js --env production
pm2 save && pm2 startup   # survives reboots
```

## 7. Put it behind HTTPS (required — Moyasar and Apple Pay both need it)

```bash
sudo apt install -y nginx certbot python3-certbot-nginx
sudo cp nginx.conf.example /etc/nginx/sites-available/agent-souq-api
# edit server_name to your real domain
sudo ln -s /etc/nginx/sites-available/agent-souq-api /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d api.your-domain.com
```

Open ports 80 and 443 in your EC2 security group (and close 4000 to the
public internet — nginx is the only thing that should reach it directly).

## 8. Apple Pay — the parts that only work in production

- Register an Apple Merchant ID in your Apple Developer account
- Upload the domain-verification file Apple/Moyasar give you into
  `public/.well-known/apple-developer-merchantid-domain-association`
  on your real domain (a placeholder README sits in that folder now)
- Register the same domain in your Moyasar dashboard's Apple Pay settings
- The current `handleApplePay()` in `checkout.jsx` is a scaffold — wiring
  the real `ApplePaySession` merchant-validation call through this backend
  is the one piece still worth double-checking against Moyasar's current
  Apple Pay docs before going live, since the exact request shape can change.

## 9. Go live checklist

- [ ] Switch `.env` to `sk_live_...` / `pk_test_...` → `pk_live_...`
- [ ] Complete Moyasar's business/KYC verification
- [ ] `CALLBACK_URL` and `FRONTEND_URL` point at real production domains
- [ ] Webhook URL updated in the Moyasar dashboard to the production domain
- [ ] `ADMIN_API_KEY` and `MOYASAR_WEBHOOK_SECRET` are long random values, not the placeholders
- [ ] `data/` folder is backed up regularly (it's your only copy of payment records)
