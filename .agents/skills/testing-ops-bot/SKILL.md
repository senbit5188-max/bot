---
name: testing-ops-bot
description: How to test the 运维客服 Telegram bot (repo senbit5188-max/bot) locally and on its deployment server without disrupting production polling.
---

# Testing the ops-bot Telegram bot

## Deployment
- Runs on 217.15.163.146 (SSH root, password in secret `SRV_146_ROOT_PASSWORD`), systemd service `ops-bot`, dir `/opt/ops-bot`, env in `/opt/ops-bot/.env` (OPS_TG_BOT_TOKEN, DEVIN_API_KEY, ADMIN_USER_IDS). Logs: `journalctl -u ops-bot`.
- Bot username `@TikTokSho98b_bot`, bot id 7960644677.

## Do NOT start a second polling instance
Never run `main.py` locally with the real OPS_TG_BOT_TOKEN while the service runs — Telegram getUpdates allows only one poller (409 Conflict, updates get stolen). If live polling tests are needed, `systemctl stop ops-bot` on the server first and `systemctl start ops-bot` afterwards.

## Known token-sharing hazard
The same Telegram token is also configured as `TELEGRAM_FEEDBACK_BOT_TOKEN` in `/opt/aister/backend/.env` on 109.123.239.207 (aister backend, node `dist/main.js`). If that backend polls Telegram, ops-bot logs show recurring `telegram.error.Conflict`. Check both servers when diagnosing conflicts.

## Offline handler testing
Best approach: call handlers directly with mocked Updates (MagicMock/AsyncMock), set env vars OPS_TG_BOT_TOKEN=fake, DB_PATH=tempfile before `import main`, and patch `main.requests.post` to avoid creating real Devin sessions. See `test_harness.py` in repo root for a full example (feedback regex, detect_project, ticket DB, /tickets, admin gating, button flow).

## Devin API key check
Harmless validity check: `curl -H "Authorization: Bearer $DEVIN_API_KEY" https://api.devin.ai/v1/sessions?limit=1` — expect HTTP 200. 403 {"detail":"Unauthorized"} means the key is invalid/expired.

## Devin Secrets Needed
- SRV_146_ROOT_PASSWORD (SSH to deployment server)
- OPS_TG_BOT_TOKEN, DEVIN_API_KEY (also present in server .env)
