#!/usr/bin/env bash
#
# Agent Souq — full production deployment script
# -------------------------------------------------
# Run this ON THE SERVER (as the ubuntu user, with sudo), after the
# project folder has been uploaded to it. See RUNBOOK.md for the two
# commands that get it there from your own machine.
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh
#
set -euo pipefail

# ---------- EDIT THESE THREE VALUES BEFORE RUNNING ----------
DOMAIN="api.your-domain.com"       # must already point (A record) at 13.62.54.243
LETSENCRYPT_EMAIL="you@example.com"
APP_DIR="/opt/agent-souq/repo/backend"
# --------------------------------------------------------------

log()  { echo -e "\n\033[1;36m▶ $1\033[0m"; }
ok()   { echo -e "\033[1;32m✓ $1\033[0m"; }
warn() { echo -e "\033[1;33m⚠ $1\033[0m"; }

if [[ $EUID -eq 0 ]]; then
  warn "Run this as the 'ubuntu' user (with sudo available), not as root directly."
fi

# 2. Inspect current environment ------------------------------------------------
log "Step 2/20 — Inspecting current environment"
echo "OS:        $(. /etc/os-release && echo "$PRETTY_NAME")"
echo "Kernel:    $(uname -r)"
echo "CPU:       $(nproc) core(s)"
echo "RAM:       $(free -h | awk '/Mem:/{print $2}')"
echo "Disk free: $(df -h / | awk 'NR==2{print $4}')"

# 3. Update the OS ----------------------------------------------------------------
log "Step 3/20 — Updating the operating system"
sudo apt-get update -y
sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
sudo apt-get autoremove -y
ok "System packages updated"

# 4. Install Docker, Docker Compose, Git, Node.js, Nginx, Certbot ----------------
log "Step 4/20 — Installing Docker"
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sudo sh
  sudo usermod -aG docker "$USER"
  ok "Docker installed (log out/in once for the group change to apply)"
else
  ok "Docker already installed"
fi

log "Installing Docker Compose plugin"
sudo apt-get install -y docker-compose-plugin

log "Installing Git"
sudo apt-get install -y git

log "Installing Node.js 20.x + build tools (for better-sqlite3's native binding)"
if ! command -v node &>/dev/null || [[ "$(node -v)" != v20* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs build-essential python3
fi
ok "Node.js $(node -v) ready"

log "Installing Nginx"
sudo apt-get install -y nginx

log "Installing Certbot"
sudo apt-get install -y certbot python3-certbot-nginx

log "Installing PM2 (fallback runner, useful outside Docker for quick restarts)"
sudo npm install -g pm2

log "Installing security/ops basics: ufw, fail2ban, unattended-upgrades"
sudo apt-get install -y ufw fail2ban unattended-upgrades

# 16. Swap file — small EC2 instances (t2/t3.micro) OOM easily during npm/docker builds
if ! swapon --show | grep -q '/swapfile'; then
  log "Step 16/20 — Adding a 2G swap file (production stability on small instances)"
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
  ok "Swap enabled"
else
  ok "Swap already configured"
fi

# 5. Project should already be uploaded here (see RUNBOOK.md) --------------------
log "Step 5/20 — Checking project files"
if [[ ! -f "$APP_DIR/server.js" ]]; then
  echo "ERROR: $APP_DIR/server.js not found."
  echo "Clone the repo to /opt/agent-souq/repo first (git clone https://github.com/moha700m/New-sala.git) — see RUNBOOK.md — then re-run this script."
  exit 1
fi
ok "Project found at $APP_DIR"
cd "$APP_DIR"

# 6. Configure environment variables ---------------------------------------------
log "Step 6/20 — Configuring environment variables"
if [[ ! -f .env ]]; then
  cp .env.example .env
  RAND1=$(openssl rand -hex 24)
  RAND2=$(openssl rand -hex 24)
  sed -i "s#change-this-to-a-long-random-string#${RAND1}#" .env
  sed -i "0,/change-this-to-a-long-random-string/! s#change-this-to-a-long-random-string#${RAND2}#" .env
  sed -i "s#CALLBACK_URL=.*#CALLBACK_URL=https://${DOMAIN}/api/payments/callback#" .env
  sed -i "s#NODE_ENV=.*#NODE_ENV=production#" .env
  warn ".env created with generated secrets — YOU STILL NEED TO EDIT MOYASAR_SECRET_KEY,"
  warn "MOYASAR_PUBLISHABLE_KEY and FRONTEND_URL in $APP_DIR/.env manually, then re-run this script."
  exit 1
else
  ok ".env already exists — leaving your values in place"
fi

if grep -q "YOUR_MOYASAR_SECRET_KEY_HERE" .env; then
  echo "ERROR: .env still has placeholder Moyasar keys. Edit $APP_DIR/.env with your real keys first."
  exit 1
fi

# 7. Build frontend/backend -------------------------------------------------------
log "Step 7/20 — Building the backend container"
sudo docker compose build

# 8. Configure database and run migrations ----------------------------------------
log "Step 8/20 — Preparing the database"
mkdir -p data public/.well-known
# db.js creates the schema automatically on first server start (see db.js) —
# nothing else to migrate for SQLite, but we sanity-check it here:
node -e "require('./db.js'); console.log('DB schema OK')" || {
  echo "ERROR: database init failed — check DB_PATH permissions in .env"
  exit 1
}
ok "Database ready at ${APP_DIR}/data/payments.db"

# 9. Start with Docker Compose, restart policy = unless-stopped -------------------
log "Step 9/20 — Starting the app (auto-restart enabled via 'restart: unless-stopped')"
sudo docker compose up -d
sleep 3
sudo docker compose ps

# 10. Configure Nginx reverse proxy ------------------------------------------------
log "Step 10/20 — Configuring Nginx reverse proxy for ${DOMAIN}"
sudo tee /etc/nginx/sites-available/agent-souq-api >/dev/null <<NGINX
server {
    listen 80;
    server_name ${DOMAIN};

    location /.well-known/apple-developer-merchantid-domain-association {
        proxy_pass http://127.0.0.1:4000;
    }

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
NGINX
sudo ln -sf /etc/nginx/sites-available/agent-souq-api /etc/nginx/sites-enabled/agent-souq-api
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
ok "Nginx configured and reloaded"

# 11. HTTPS via Let's Encrypt -------------------------------------------------------
log "Step 11/20 — Requesting HTTPS certificate"
if host "$DOMAIN" >/dev/null 2>&1; then
  sudo certbot --nginx -d "$DOMAIN" -m "$LETSENCRYPT_EMAIL" --agree-tos --redirect -n
  ok "HTTPS certificate installed for $DOMAIN"
else
  warn "DNS for $DOMAIN doesn't resolve yet — skipping certbot. Point an A record at"
  warn "13.62.54.243, then run: sudo certbot --nginx -d $DOMAIN -m $LETSENCRYPT_EMAIL --agree-tos --redirect"
fi

# 12/13. Verify Moyasar + API + DB connectivity ------------------------------------
log "Step 12-13/20 — Verifying API and database connectivity"
sleep 2
HEALTH=$(curl -fsS http://127.0.0.1:4000/health || echo "FAILED")
if [[ "$HEALTH" == *'"ok":true'* ]]; then
  ok "Backend health check passed: $HEALTH"
else
  warn "Health check did not return ok — checking logs:"
  sudo docker compose logs --tail=50
fi

ADMIN_KEY=$(grep ADMIN_API_KEY .env | cut -d= -f2)
DB_CHECK=$(curl -fsS -H "x-admin-key: ${ADMIN_KEY}" http://127.0.0.1:4000/api/admin/payments || echo "FAILED")
if [[ "$DB_CHECK" == "FAILED" ]]; then
  warn "Could not reach /api/admin/payments — check logs above"
else
  ok "Database query endpoint responding (payments table reachable)"
fi

# 14. Verify site loads --------------------------------------------------------------
log "Step 14/20 — Verifying public HTTPS endpoint"
if curl -fsS "https://${DOMAIN}/health" >/dev/null 2>&1; then
  ok "https://${DOMAIN}/health responds correctly"
else
  warn "Public HTTPS check failed — likely DNS not propagated yet or certbot skipped above"
fi

# 17. Auto-restart on reboot ----------------------------------------------------------
log "Step 17/20 — Ensuring services survive a reboot"
sudo systemctl enable docker
sudo systemctl enable nginx
ok "Docker and Nginx will start automatically on boot; docker-compose 'restart: unless-stopped' brings the app back up with them"

# 18. Security hardening ---------------------------------------------------------------
log "Step 18/20 — Applying security basics"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
sudo systemctl enable fail2ban --now
sudo dpkg-reconfigure -f noninteractive unattended-upgrades || true
ok "Firewall (ufw) restricts inbound to SSH + HTTP/HTTPS only; fail2ban + auto security updates enabled"
warn "Confirm your EC2 Security Group in the AWS console also only allows 22, 80, 443 inbound."

# 19. Remove temporary files -------------------------------------------------------------
log "Step 19/20 — Cleaning up"
sudo apt-get autoremove -y
sudo apt-get clean
sudo docker image prune -f
ok "Temporary files and unused Docker layers removed"

# 20. Final status ------------------------------------------------------------------------
log "Step 20/20 — Deployment summary"
echo "---------------------------------------------"
sudo docker compose ps
echo "---------------------------------------------"
echo "Production URL: https://${DOMAIN}"
echo "Health check:   https://${DOMAIN}/health"
echo "---------------------------------------------"
ok "Deployment complete."
warn "Remaining MANUAL step: Apple Pay merchant validation — see APPLE_PAY_MANUAL_STEPS.md"
