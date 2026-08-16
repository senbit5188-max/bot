# Test Plan: 运维客服 Telegram bot (PR #5)

Approach: offline harness in /home/ubuntu/repos/bot calling handlers directly with constructed/mocked Update objects (no second polling instance), plus deployed-service health checks over SSH, plus a harmless real Devin API GET to validate the key. No recording (headless/API test).

## T1: Feedback detection files ticket + inline button (on_message)
- Construct fake Update with text "方舟登录不了，一直报错" from user 111 in chat -100123; call on_message.
- PASS: new row in temp sqlite DB with text stored, project == "senbit5188-max/yumiren"; reply_html called with "已收到反馈，登记为工单 <b>#1</b>" and InlineKeyboardMarkup callback_data "fix:1".
- Negative: text "今天天气不错" → no DB row, no reply.

## T2: detect_project mapping
- "spark-im 卡死" → senbit5188-max/spark-im; "AISTER crash" → senbit5188-max/AISTER; "无关文本" → default senbit5188-max/spark-im; "方舟白屏" → senbit5188-max/yumiren.

## T3: /tickets output
- After T1 ticket exists, call cmd_tickets; PASS: reply_text contains "#1 [open]" and the ticket text prefix. Empty-DB case replies "暂无工单。".

## T4: Admin gating (/fix and button)
- With ADMIN_USER_IDS={6159132946}: cmd_fix from user 999 → reply "只有管理员可以使用 /fix。" and no requests.post call; on_button from non-admin → "只有管理员可以触发 Devin 会话。".
- cmd_fix from admin 6159132946 with args, requests.post mocked returning {"session_id":"devin-x","url":"https://app.devin.ai/sessions/x"} → PASS: reply contains that URL; POST called to https://api.devin.ai/v1/sessions with Bearer header and prompt containing the description.

## T5: Button flow updates ticket (on_button, mocked API)
- Admin clicks fix:1 → PASS: mocked POST called, DB row status='processing', devin_session_url stored; reply contains URL. Second click on same ticket → "已有 Devin 会话" with existing URL, no second POST.

## T6: Deployed service health (SSH 217.15.163.146)
- PASS: systemctl active (running); recent journalctl shows getUpdates 200 OK and no new tracebacks after startup; /opt/ops-bot/.env has OPS_TG_BOT_TOKEN, DEVIN_API_KEY, ADMIN_USER_IDS=6159132946.
- Telegram getMe with the deployed token → username == TikTokSho98b_bot.

## T7: Real Devin API key sanity (harmless GET)
- GET https://api.devin.ai/v1/sessions?limit=1 with Bearer $DEVIN_API_KEY → PASS: HTTP 200. No session creation.
