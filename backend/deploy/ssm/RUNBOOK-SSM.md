# RUNBOOK — Unattended deployment via AWS Systems Manager (no SSH)

This package deploys Agent Souq to your EC2 instance (`13.62.54.243`,
region `eu-north-1`) entirely through SSM Run Command — no SSH, no inbound
ports, no manual server-side terminal work.

## The one thing I can't do for you — and why

I don't have your AWS credentials, and I have no outbound network access
from my environment, so I can't call the AWS APIs myself. The four scripts
below make the deployment *unattended on the server side* — you never SSH in
or run server commands by hand — but someone with your AWS access has to
kick them off from a CLI. The cleanest place to do that with zero local
setup is **AWS CloudShell** (a terminal built into the AWS console, already
authenticated as you): open the console → click the CloudShell icon → upload
this `ssm/` folder → run the scripts. That keeps everything inside AWS.

I deliberately did **not** put any way for secrets to leak into command logs
(see `00-upload-secrets.sh` — it uses an encrypted Parameter Store value).

## Prerequisites (the scripts check these and guide you if missing)

- The instance must reach SSM endpoints over outbound HTTPS (443). Ubuntu
  16.04+ ships the SSM Agent pre-installed, so usually nothing to install.
- An IAM instance profile with `AmazonSSMManagedInstanceCore` — `01-prepare-ssm.sh`
  creates and attaches this for you.

## Order of operations (run these in AWS CloudShell)

```bash
cd ssm
chmod +x *.sh

# 1. One-time: make the instance SSM-managed (creates IAM role + profile,
#    attaches it, waits until the instance shows ONLINE in SSM)
./01-prepare-ssm.sh

# 2. Get your real .env (with real Moyasar keys) onto the box, encrypted,
#    without exposing secrets in any log. Edit LOCAL_ENV_FILE path at the top first.
./00-upload-secrets.sh

# 3. Register the deploy document and run the full deployment.
#    Edit DOMAIN / EMAIL / REPO_URL at the top first.
./02-run-deploy.sh
```

That's it. `02-run-deploy.sh` streams the deployment status and then prints
the full server-side output, ending with your production URL.

## What `02-run-deploy.sh` does on the instance (all 12 objectives)

Runs `agent-souq-deploy-document.json`, which performs: OS update · installs
Docker + Compose + Node + Nginx + Certbot + ufw/fail2ban · 2 GB swap · fetches
project (`git clone` over HTTPS from your GitHub repo) · loads the encrypted
`.env` · `docker compose build` · SQLite schema init · `docker compose up -d`
with `restart: unless-stopped` · Nginx reverse proxy · Let's Encrypt HTTPS ·
enables services on boot · firewall + auto security updates · local + DB +
public health checks · cleanup · prints the final URL.

## Getting the project onto the box

The deploy document clones directly from GitHub over HTTPS:

    https://github.com/moha700m/New-sala.git

This URL is already set as the default in both `02-run-deploy.sh` (`REPO_URL`)
and the SSM document (`RepoUrl` parameter), so there's nothing to edit — the
document runs `git clone` into `/opt/agent-souq/repo` and deploys from
`backend/`.

Note: `00-upload-secrets.sh` writes `.env` directly onto the instance, so the
cloned repo never needs to contain your secrets (and it doesn't — `.gitignore`
keeps `.env` out).

## Verifying afterward (also no SSH)

```bash
# See it registered and online
aws ssm describe-instance-information --region eu-north-1

# Re-run just the health portion any time
aws ssm send-command --region eu-north-1 --instance-ids <id> \
  --document-name AWS-RunShellScript \
  --parameters commands="curl -fsS http://127.0.0.1:4000/health"
```

## Apple Pay

Still the only manual remainder — see `../APPLE_PAY_MANUAL_STEPS.md`.
Everything else (Mada, Visa, Mastercard, HTTPS, DB, auto-restart, firewall)
is fully covered by the automation above.
