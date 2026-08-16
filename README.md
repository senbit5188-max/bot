# 运维客服 Telegram Bot

监听 Telegram 群消息，自动识别报错/反馈并登记工单，可一键创建 Devin 会话排查修复代码问题。

## 功能

- 自动识别群内反馈/报错消息（中英文关键词），回复确认并登记工单（SQLite）
- 工单消息带「创建 Devin 会话修复」按钮，管理员点击即调用 Devin API 创建会话
- `/fix <描述>`（或回复某条消息发 `/fix`）直接创建 Devin 会话
- `/tickets` 查看最近工单及对应 Devin 会话链接
- 根据消息内容自动匹配项目仓库（spark-im / 方舟 / AISTER / xinw）

## 部署（217.15.163.146）

```bash
mkdir -p /opt/ops-bot && cd /opt/ops-bot
# 拷贝 main.py requirements.txt ops-bot.service
python3 -m venv venv && venv/bin/pip install -r requirements.txt
cat > .env <<'EOF'
OPS_TG_BOT_TOKEN=<bot token>
DEVIN_API_KEY=<devin service user key, cog_...>
DEVIN_ORG_ID=<org-...>
ADMIN_USER_IDS=<逗号分隔的管理员 Telegram user id，留空则任何人可触发>
EOF
chmod 600 .env
cp ops-bot.service /etc/systemd/system/
systemctl daemon-reload && systemctl enable --now ops-bot
```

把 bot 拉进群并在 BotFather 里关闭 Group Privacy（/setprivacy → Disable），bot 才能看到普通群消息。
