# Push to GitHub — one command

This archive is a real Git repository with your remote already set to
`https://github.com/moha700m/New-sala.git` and two commits of history intact.
Nothing to configure — just authenticate and push.

## Steps

```bash
# 1. Unpack (creates a folder with the .git already inside)
mkdir New-sala && tar -xzf agent-souq-repo.tar.gz -C New-sala
cd New-sala

# 2. Confirm it's wired (optional sanity check)
git remote -v          # → origin  https://github.com/moha700m/New-sala.git
git log --oneline      # → two commits

# 3. Push (history preserved)
git push -u origin main
```

If your GitHub repo was created with an initial commit (e.g. a README), the
push may be rejected as non-fast-forward. In that case either:

```bash
# Option A — your local history is the source of truth (recommended, clean):
git push -u origin main --force-with-lease

# Option B — merge GitHub's initial commit in first:
git pull origin main --allow-unrelated-histories --no-edit
git push -u origin main
```

## Authentication (HTTPS)

When prompted for a password, use a **Personal Access Token**, not your
account password (GitHub requires this for HTTPS pushes). Create one at
GitHub → Settings → Developer settings → Personal access tokens → Fine-grained,
with "Contents: Read and write" on this repo.

Or with the GitHub CLI, `gh auth login` once and the push just works.

## After the push — deploy

The repo is the deployment source. Continue with the SSM flow — everything
is already pointed at `New-sala`:

```bash
cd backend/deploy/ssm
./01-prepare-ssm.sh      # make the EC2 instance SSM-managed
./00-upload-secrets.sh   # push encrypted .env (edit LOCAL_ENV_FILE path first)
./02-run-deploy.sh       # clones New-sala over HTTPS and deploys end to end
```
