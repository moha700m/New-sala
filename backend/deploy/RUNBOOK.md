# RUNBOOK — Deploying to your EC2 server (13.62.54.243)

I can't SSH out to your server from here (no outbound network access in
this sandbox), so these are the exact commands to run yourself. Everything
below is copy-paste — nothing needs to be figured out on the fly.

Also: please **rotate the `Ag_4.pem` key pair in the AWS console** once
you're done, since it was uploaded into this chat. Generate a fresh key
pair and update the instance/your local `~/.ssh` — cheap insurance.

## 1. Secure the key locally (on your own machine, not here)

```bash
chmod 400 ~/Downloads/Ag_4.pem   # wherever you saved it
```

## 2. Upload the project to the server

From the repo root (containing `backend/`) on your machine:

```bash
ssh -i ~/Downloads/Ag_4.pem ubuntu@13.62.54.243 "sudo mkdir -p /opt/agent-souq && sudo chown ubuntu:ubuntu /opt/agent-souq"

rsync -avz -e "ssh -i ~/Downloads/Ag_4.pem" \
  --exclude 'node_modules' --exclude 'data' --exclude '.env' \
  ./backend/ ubuntu@13.62.54.243:/opt/agent-souq/repo/backend/
```

## 3. SSH in and fill in your real secrets

```bash
ssh -i ~/Downloads/Ag_4.pem ubuntu@13.62.54.243
cd /opt/agent-souq/repo/backend
cp .env.example .env
nano .env
```

Fill in at minimum:
- `MOYASAR_SECRET_KEY` / `MOYASAR_PUBLISHABLE_KEY` (from dashboard.moyasar.com)
- `FRONTEND_URL` (your real deployed frontend origin)

Leave `MOYASAR_WEBHOOK_SECRET` / `ADMIN_API_KEY` as-is — `deploy.sh` generates
strong random values for those automatically on first run.

## 4. Edit two lines in deploy.sh before running it

```bash
nano deploy/deploy.sh
```

Change:
```bash
DOMAIN="api.your-domain.com"       # → a real domain/subdomain you control,
                                    #    with an A record pointing at 13.62.54.243
LETSENCRYPT_EMAIL="you@example.com"
```

Certbot needs that domain to already resolve to this server, or step 11
(HTTPS) will be skipped with a clear message telling you to re-run it
once DNS propagates.

## 5. Run it

```bash
chmod +x deploy/deploy.sh
./deploy/deploy.sh
```

It runs all 20 steps end to end: OS update, Docker/Node/Nginx/Certbot
install, env config, build, DB init, container start with auto-restart,
Nginx reverse proxy, HTTPS, health checks, firewall hardening, cleanup,
and a final summary with your live URL.

If it stops partway (e.g. missing real Moyasar keys, DNS not ready yet),
it tells you exactly what to fix — fix that one thing and run it again;
every step is safe to re-run.

## 6. What's left after that — Apple Pay only

See `APPLE_PAY_MANUAL_STEPS.md`. Everything else (Mada, Visa, Mastercard,
HTTPS, database, auto-restart, firewall) is fully automated by the script.
