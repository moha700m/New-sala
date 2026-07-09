#!/usr/bin/env bash
#
# 00-upload-secrets.sh — get your .env onto the instance WITHOUT SSH and
# without ever putting secret keys inside the SSM document or command logs.
# ---------------------------------------------------------------------------
# Approach: store the whole .env file in SSM Parameter Store as a SecureString
# (encrypted with KMS), then a tiny Run Command pulls it onto the instance.
# The secret value is encrypted at rest and never printed in command output.
#
set -euo pipefail

# ---------- EDIT THESE ----------
REGION="eu-north-1"
INSTANCE_IP="13.62.54.243"
LOCAL_ENV_FILE="../../.env"          # path to your real, filled-in .env
PARAM_NAME="/agent-souq/env"
APP_DIR="/opt/agent-souq/repo/backend"
# --------------------------------

if [[ ! -f "$LOCAL_ENV_FILE" ]]; then
  echo "ERROR: $LOCAL_ENV_FILE not found. Create it from .env.example with your real Moyasar keys first."
  exit 1
fi
if grep -q 'YOUR_MOYASAR_SECRET_KEY_HERE' "$LOCAL_ENV_FILE"; then
  echo "ERROR: $LOCAL_ENV_FILE still has placeholder keys. Fill in real values first."
  exit 1
fi

echo "▶ Uploading .env to SSM Parameter Store as an encrypted SecureString..."
aws ssm put-parameter --region "$REGION" \
  --name "$PARAM_NAME" \
  --type SecureString \
  --value "file://${LOCAL_ENV_FILE}" \
  --overwrite >/dev/null
echo "✓ Stored at ${PARAM_NAME} (encrypted with your account's default KMS key)"

INSTANCE_ID=$(aws ec2 describe-instances --region "$REGION" \
  --filters "Name=ip-address,Values=${INSTANCE_IP}" "Name=instance-state-name,Values=running" \
  --query "Reservations[0].Instances[0].InstanceId" --output text)

echo "▶ Pulling it onto ${INSTANCE_ID} into ${APP_DIR}/.env ..."
# NOTE: for the instance to read the parameter, its SSM role needs ssm:GetParameter
# + kms:Decrypt on this parameter. AmazonSSMManagedInstanceCore already allows
# ssm:GetParameter; if you used a custom KMS key, also grant kms:Decrypt.
CMD_ID=$(aws ssm send-command --region "$REGION" \
  --instance-ids "$INSTANCE_ID" \
  --document-name "AWS-RunShellScript" \
  --parameters commands="mkdir -p ${APP_DIR} && aws ssm get-parameter --region ${REGION} --name ${PARAM_NAME} --with-decryption --query Parameter.Value --output text > ${APP_DIR}/.env && chmod 600 ${APP_DIR}/.env && echo env-written" \
  --query "Command.CommandId" --output text)

sleep 8
aws ssm get-command-invocation --region "$REGION" \
  --command-id "$CMD_ID" --instance-id "$INSTANCE_ID" \
  --query "StandardOutputContent" --output text

echo "✓ .env is on the instance (mode 600). Secret value was never printed."
echo "  Tip: after a successful deploy you can delete the parameter if you prefer:"
echo "    aws ssm delete-parameter --region ${REGION} --name ${PARAM_NAME}"
