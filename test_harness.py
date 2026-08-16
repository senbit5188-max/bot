"""Offline harness tests for ops-bot handlers (no Telegram network)."""
import asyncio
import os
import sqlite3
import sys
import tempfile
from types import SimpleNamespace
from unittest.mock import AsyncMock, MagicMock, patch

DB = tempfile.mktemp(suffix=".db")
os.environ["OPS_TG_BOT_TOKEN"] = "TEST:TOKEN"
os.environ["DEVIN_API_KEY"] = "fake-key"
os.environ["ADMIN_USER_IDS"] = "6159132946"
os.environ["DB_PATH"] = DB

import main  # noqa: E402

RESULTS = []


def check(name, cond, detail=""):
    RESULTS.append((name, bool(cond), detail))
    print(f"{'PASS' if cond else 'FAIL'}: {name} {detail}")


def fake_msg(text, user_id=111, name="张三", chat_id=-100123, message_id=42):
    msg = MagicMock()
    msg.text = text
    msg.chat_id = chat_id
    msg.message_id = message_id
    msg.reply_text = AsyncMock()
    msg.reply_html = AsyncMock()
    msg.reply_to_message = None
    user = SimpleNamespace(id=user_id, full_name=name)
    upd = MagicMock()
    upd.effective_message = msg
    upd.effective_user = user
    return upd, msg


async def run():
    # T1 feedback detection
    upd, msg = fake_msg("方舟登录不了，一直报错")
    await main.on_message(upd, None)
    conn = sqlite3.connect(DB)
    rows = conn.execute("SELECT id, text, project, status FROM tickets").fetchall()
    check("T1 ticket row inserted", len(rows) == 1, str(rows))
    check("T1 project mapped to yumiren", rows and rows[0][2] == "senbit5188-max/yumiren")
    check("T1 status open", rows and rows[0][3] == "open")
    args, kwargs = msg.reply_html.call_args
    check("T1 reply contains 工单 #1", "工单 <b>#1</b>" in args[0], args[0][:60])
    kb = kwargs["reply_markup"].inline_keyboard
    check("T1 button callback_data fix:1", kb[0][0].callback_data == "fix:1",
          f"text={kb[0][0].text!r}")
    # T1 negative
    upd2, msg2 = fake_msg("今天天气不错")
    await main.on_message(upd2, None)
    n = conn.execute("SELECT count(*) FROM tickets").fetchone()[0]
    check("T1neg no ticket for normal text", n == 1 and not msg2.reply_html.called)

    # T2 detect_project
    check("T2 spark-im", main.detect_project("spark-im 卡死") == "senbit5188-max/spark-im")
    check("T2 AISTER (case-insens)", main.detect_project("AISTER crash") == "senbit5188-max/AISTER")
    check("T2 default", main.detect_project("无关文本") == "senbit5188-max/spark-im")
    check("T2 方舟", main.detect_project("方舟白屏") == "senbit5188-max/yumiren")

    # T3 /tickets
    upd3, msg3 = fake_msg("/tickets")
    await main.cmd_tickets(upd3, None)
    out = msg3.reply_text.call_args[0][0]
    check("T3 tickets lists #1 [open]", "#1 [open]" in out and "方舟登录不了" in out, out[:80])

    # T4 admin gating on /fix
    upd4, msg4 = fake_msg("/fix 测试", user_id=999)
    ctx = SimpleNamespace(args=["测试"])
    with patch.object(main.requests, "post") as p:
        await main.cmd_fix(upd4, ctx)
        check("T4 non-admin /fix rejected",
              msg4.reply_text.call_args[0][0] == "只有管理员可以使用 /fix。" and not p.called)

    fake_resp = MagicMock()
    fake_resp.json.return_value = {"session_id": "devin-x", "url": "https://app.devin.ai/sessions/x"}
    fake_resp.raise_for_status.return_value = None

    upd5, msg5 = fake_msg("/fix spark-im 登录失败", user_id=6159132946)
    ctx5 = SimpleNamespace(args=["spark-im", "登录失败"])
    with patch.object(main.requests, "post", return_value=fake_resp) as p:
        await main.cmd_fix(upd5, ctx5)
        check("T4 admin /fix POSTs to devin api",
              p.called and p.call_args[0][0] == "https://api.devin.ai/v1/sessions")
        check("T4 bearer header",
              p.call_args[1]["headers"]["Authorization"] == "Bearer fake-key")
        check("T4 prompt contains desc",
              "spark-im 登录失败" in p.call_args[1]["json"]["prompt"])
        check("T4 reply contains url",
              "https://app.devin.ai/sessions/x" in msg5.reply_text.call_args[0][0])

    # T5 button flow
    def cbq(user_id, data="fix:1"):
        q = MagicMock()
        q.answer = AsyncMock()
        q.from_user = SimpleNamespace(id=user_id)
        q.data = data
        q.message = MagicMock()
        q.message.reply_text = AsyncMock()
        u = MagicMock()
        u.callback_query = q
        return u, q

    u6, q6 = cbq(999)
    with patch.object(main.requests, "post") as p:
        await main.on_button(u6, None)
        check("T5 non-admin button rejected",
              q6.message.reply_text.call_args[0][0] == "只有管理员可以触发 Devin 会话。" and not p.called)

    u7, q7 = cbq(6159132946)
    with patch.object(main.requests, "post", return_value=fake_resp) as p:
        await main.on_button(u7, None)
        check("T5 admin button POSTs", p.called)
    row = conn.execute("SELECT status, devin_session_id, devin_session_url FROM tickets WHERE id=1").fetchone()
    check("T5 ticket updated processing+url",
          row == ("processing", "devin-x", "https://app.devin.ai/sessions/x"), str(row))
    check("T5 reply contains url",
          "https://app.devin.ai/sessions/x" in q7.message.reply_text.call_args[0][0])

    u8, q8 = cbq(6159132946)
    with patch.object(main.requests, "post") as p:
        await main.on_button(u8, None)
        check("T5 second click no new session",
              not p.called and "已有 Devin 会话" in q8.message.reply_text.call_args[0][0])

    # T3b empty db
    os.remove(DB)
    upd9, msg9 = fake_msg("/tickets")
    await main.cmd_tickets(upd9, None)
    check("T3 empty db 暂无工单", msg9.reply_text.call_args[0][0] == "暂无工单。")

    fails = [r for r in RESULTS if not r[1]]
    print(f"\n{len(RESULTS)} checks, {len(fails)} failed")
    sys.exit(1 if fails else 0)


asyncio.run(run())
