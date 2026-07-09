#!/usr/bin/env bash
#
# 02-run-deploy.sh — register the SSM document and fire the deployment.
# ---------------------------------------------------------------------
# Run from your AWS CLI environment (laptop or AWS CloudShell). No SSH.
#
# Prereqs: 01-prepare-ssm.sh has been run and reported the instance ONLINE,
# and your secrets have been uploaded (see upload-secrets section below).
#
set -euo pipefail

# ---------- EDIT THESE ----------
INSTANCE_IP="13.62.54.243"
REGION="eu-north-1"
DOMAIN="api.your-domain.com"
EMAIL="you@example.com"
REPO_URL=""                       # optional: git URL of your repo; blank if pre-uploaded via S3
DOC_NAME="AgentSouqDeploy"
# --------------------------------

if [[ -z "$REPO_URL" ]]; then
  echo "ERROR: set REPO_URL at the top of this script to your GitHub repo URL first."
  exit 1
fi

echo "▶ Resolving instance id..."
INSTANCE_ID=$(aws ec2 describe-instances --region "$REGION" \
  --filters "Name=ip-address,Values=${INSTANCE_IP}" "Name=instance-state-name,Values=running" \
  --query "Reservations[0].Instances[0].InstanceId" --output text)
echo "✓ Instance: ${INSTANCE_ID}"

echo "▶ Registering (or updating) the SSM document '${DOC_NAME}'..."
if aws ssm describe-document --region "$REGION" --name "$DOC_NAME" >/dev/null 2>&1; then
  aws ssm update-document --region "$REGION" --name "$DOC_NAME" \
    --document-version '$LATEST' \
    --content file://agent-souq-deploy-document.json \
    --document-format JSON >/dev/null && echo "✓ Document updated" \
    || echo "• No change to document content"
else
  aws ssm create-document --region "$REGION" --name "$DOC_NAME" \
    --document-type Command --document-format JSON \
    --content file://agent-souq-deploy-document.json >/dev/null
  echo "✓ Document created"
fi

echo "▶ Sending the deployment command..."
CMD_ID=$(aws ssm send-command --region "$REGION" \
  --document-name "$DOC_NAME" \
  --instance-ids "$INSTANCE_ID" \
  --parameters "Domain=${DOMAIN},LetsEncryptEmail=${EMAIL},RepoUrl=${REPO_URL}" \
  --query "Command.CommandId" --output text)
echo "✓ Command sent: ${CMD_ID}"

echo "▶ Streaming status (Ctrl-C to stop watching; the deploy keeps running server-side)..."
while true; do
  STATUS=$(aws ssm get-command-invocation --region "$REGION" \
    --command-id "$CMD_ID" --instance-id "$INSTANCE_ID" \
    --query "Status" --output text 2>/dev/null || echo "Pending")
  echo "  status: ${STATUS}"
  if [[ "$STATUS" == "Success" || "$STATUS" == "Failed" || "$STATUS" == "TimedOut" || "$STATUS" == "Cancelled" ]]; then
    break
  fi
  sleep 10
done

echo ""
echo "===== DEPLOYMENT OUTPUT ====="
aws ssm get-command-invocation --region "$REGION" \
  --command-id "$CMD_ID" --instance-id "$INSTANCE_ID" \
  --query "StandardOutputContent" --output text
echo "===== STDERR (if any) ====="
aws ssm get-command-invocation --region "$REGION" \
  --command-id "$CMD_ID" --instance-id "$INSTANCE_ID" \
  --query "StandardErrorContent" --output text

echo ""
echo "Final status: ${STATUS}"
[[ "$STATUS" == "Success" ]] && echo "✓ Production URL: https://${DOMAIN}"
