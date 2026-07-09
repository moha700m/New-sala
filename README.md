# Agent Souq — سوق الوكلاء

A bilingual (Saudi Arabic / English) marketplace and directory for AI agents,
with a production-ready Moyasar payment backend (Mada / Visa / Mastercard /
Apple Pay) for the Saudi market.

## Repository layout

```
frontend/          React pages (bilingual RTL/LTR, Sadu-inspired design)
  src/pages/
    agent-souq.jsx        Home / agent directory (real AI tools + links)
    agent-detail.jsx      Individual agent profile
    submit-agent.jsx      "List your agent" 3-step form
    auth-page.jsx         Login / sign-up
    owner-dashboard.jsx   Agent owner stats dashboard
    about-page.jsx        About page
    checkout.jsx          Moyasar checkout (fully wired to backend)

backend/           Node.js + Express payment service
    server.js             API: payments, callback, webhook, admin
    db.js                 SQLite persistence for payment records
    Dockerfile / docker-compose.yml
    deploy/               Deployment automation
      deploy.sh           One-shot server-side deploy
      ssm/                Fully unattended AWS SSM deployment (no SSH)
```

## Quick start (local backend)

```bash
cd backend
cp .env.example .env      # add your Moyasar keys
npm install
npm start                 # http://localhost:4000/health
```

## Production deployment

Fully automated via AWS Systems Manager — no SSH required.
See `backend/deploy/ssm/RUNBOOK-SSM.md`.

## Payment integration

Mada, Visa, and Mastercard are fully implemented end to end. Apple Pay needs
Apple-side merchant verification — see `backend/deploy/APPLE_PAY_MANUAL_STEPS.md`.

## Frontend note

The `.jsx` pages are self-contained (Tailwind classes + lucide-react icons),
built and previewed as Claude artifacts. To run them as a real app, drop them
into a Vite + React + Tailwind project and wire a router — each file exports a
default component. `checkout.jsx` already calls the live backend; set its
`API_BASE_URL` and `MOYASAR_PUBLISHABLE_KEY` constants.
