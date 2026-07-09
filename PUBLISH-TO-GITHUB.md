# Publishing this repo to GitHub

The repository is already fully initialized and committed inside this project
folder — you just need to create the GitHub remote and push. Two ways; pick one.

## Option A — GitHub CLI (one command, easiest)

If you have the `gh` CLI installed and logged in (`gh auth login`):

```bash
cd agent-souq-repo
gh repo create agent-souq --public --source=. --remote=origin --push
```

That creates the GitHub repo named `agent-souq`, links it, and pushes `main`
in one step. Use `--private` instead of `--public` if you prefer.

Your clone URL will be:  `https://github.com/<your-username>/agent-souq.git`

## Option B — Manual (no gh CLI)

1. Create an empty repo on github.com (no README/gitignore — this repo already
   has them). Copy its URL.
2. Then:

```bash
cd agent-souq-repo
git remote add origin https://github.com/<your-username>/agent-souq.git
git branch -M main
git push -u origin main
```

If the repo is private, the EC2 instance needs read access to clone it during
deployment — see the note below.

## After it's on GitHub — continue the deployment

Put your repo URL into the SSM deploy trigger:

```bash
cd backend/deploy/ssm
# edit 02-run-deploy.sh → set REPO_URL="https://github.com/<you>/agent-souq.git"
./02-run-deploy.sh
```

The SSM document now `git clone`s that URL into `/opt/agent-souq/repo` and
deploys from `backend/`. Full flow (from RUNBOOK-SSM.md):

```bash
cd backend/deploy/ssm
./01-prepare-ssm.sh       # make instance SSM-managed
./00-upload-secrets.sh    # push encrypted .env (edit LOCAL_ENV_FILE path first)
./02-run-deploy.sh        # clone from GitHub + deploy
```

## Private repo? Two clean options

- **Public repo** — simplest; nothing extra. The code has no secrets in it
  (the `.gitignore` keeps `.env` out), so public is safe here.
- **Private repo** — generate a GitHub *fine-grained personal access token*
  with read-only "Contents" scope, store it in SSM Parameter Store, and have
  the clone use `https://<token>@github.com/...`. Tell me if you want this and
  I'll adjust the deploy document to pull the token securely (never in logs).

## Verify the push worked

```bash
git -C agent-souq-repo log --oneline -1
git -C agent-souq-repo remote -v
```
