#!/usr/bin/env bash
#
# 01-prepare-ssm.sh — one-time setup so SSM can manage instance i @ 13.62.54.243
# ------------------------------------------------------------------------------
# Run this from anywhere you have the AWS CLI configured with credentials that
# can touch IAM + EC2 (your admin laptop, CloudShell in the AWS console, etc.).
# It does NOT touch the server over SSH — it only calls AWS APIs.
#
# What it does:
#   1. Creates an IAM role + instance profile with AmazonSSMManagedInstanceCore
#   2. Attaches that instance profile to your running EC2 instance
#   3. Waits for the instance to register as an SSM "managed instance"
#
# After this, the SSM Agent (pre-installed on Ubuntu 16.04+) can receive
# Run Command documents — no SSH, no inbound ports.
#
set -euo pipefail

# ---------- EDIT IF NEEDED ----------
INSTANCE_IP="13.62.54.243"
REGION="eu-north-1"          # your instance is in eu-north-1 per earlier context
ROLE_NAME="AgentSouqSSMRole"
PROFILE_NAME="AgentSouqSSMInstanceProfile"
# ------------------------------------

echo "▶ Resolving instance id for public IP ${INSTANCE_IP} in ${REGION}..."
INSTANCE_ID=$(aws ec2 describe-instances \
  --region "$REGION" \
  --filters "Name=ip-address,Values=${INSTANCE_IP}" "Name=instance-state-name,Values=running" \
  --query "Reservations[0].Instances[0].InstanceId" --output text)

if [[ "$INSTANCE_ID" == "None" || -z "$INSTANCE_ID" ]]; then
  echo "ERROR: No running instance found with public IP ${INSTANCE_IP} in ${REGION}."
  echo "Check the region — if your instance isn't in ${REGION}, edit REGION at the top of this script."
  exit 1
fi
echo "✓ Instance: ${INSTANCE_ID}"

echo "▶ Creating IAM role (skips if it already exists)..."
cat > /tmp/ssm-trust.json <<'JSON'
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
JSON

aws iam create-role --role-name "$ROLE_NAME" \
  --assume-role-policy-document file:///tmp/ssm-trust.json 2>/dev/null \
  && echo "✓ Role created" || echo "• Role already exists, continuing"

aws iam attach-role-policy --role-name "$ROLE_NAME" \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore
echo "✓ AmazonSSMManagedInstanceCore attached"

echo "▶ Creating instance profile and linking the role..."
aws iam create-instance-profile --instance-profile-name "$PROFILE_NAME" 2>/dev/null \
  && echo "✓ Instance profile created" || echo "• Instance profile already exists"

aws iam add-role-to-instance-profile \
  --instance-profile-name "$PROFILE_NAME" --role-name "$ROLE_NAME" 2>/dev/null \
  && echo "✓ Role added to instance profile" || echo "• Role already in profile"

echo "▶ Waiting 10s for IAM propagation..."
sleep 10

echo "▶ Associating the instance profile with ${INSTANCE_ID}..."
# If a different profile is already attached this will report an error you can ignore;
# if none is attached, this attaches ours.
aws ec2 associate-iam-instance-profile \
  --region "$REGION" \
  --instance-id "$INSTANCE_ID" \
  --iam-instance-profile Name="$PROFILE_NAME" 2>/dev/null \
  && echo "✓ Instance profile associated" \
  || echo "• An instance profile may already be attached — verify it includes AmazonSSMManagedInstanceCore"

echo "▶ Waiting for the instance to register with SSM (up to ~3 min)..."
for i in {1..18}; do
  PING=$(aws ssm describe-instance-information \
    --region "$REGION" \
    --filters "Key=InstanceIds,Values=${INSTANCE_ID}" \
    --query "InstanceInformationList[0].PingStatus" --output text 2>/dev/null || echo "None")
  if [[ "$PING" == "Online" ]]; then
    echo "✓ Instance is ONLINE in SSM — ready for Run Command."
    echo "INSTANCE_ID=${INSTANCE_ID}"
    exit 0
  fi
  echo "  ...still registering (${i}/18), status=${PING}"
  sleep 10
done

echo "⚠ Instance did not come online in SSM within the timeout."
echo "  Most common causes:"
echo "   - The instance needs outbound HTTPS (443) to SSM endpoints (check its security group egress + route to internet)."
echo "   - SSM Agent not running. On Ubuntu: it's usually pre-installed; a reboot often fixes registration."
echo "   - The instance profile wasn't actually attached (see message above)."
echo "  Re-run this script after addressing, it's safe to run repeatedly."
exit 1
