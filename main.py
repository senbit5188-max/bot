"""运维客服 Telegram bot.

Watches group chats for user feedback / bug reports, acknowledges them,
stores them as tickets, and (on demand) creates Devin sessions via the
Devin API to investigate and fix code issues.

Environment variables:
    OPS_TG_BOT_TOKEN   Telegram bot token (required)
    DEVIN_API_KEY      Devin API key (optional; Devin session creation
                       is disabled when missing)
    ADMIN_USER_IDS     comma-separated Telegram user IDs allowed to
                       trigger Devin sessions (optional; empty = anyone)
    DB_PATH            sqlite database path (default: tickets.db)
"""

import html
import logging
import os
import re
import sqlite3
import time

import requests
from telegram import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    Update,
)
from telegram.ext import (
    Application,
    CallbackQueryHandler,
    CommandHandler,
    ContextTypes,
    MessageHandler,
    filters,
)

logging.basicConfig(
    format="%(asctime)s %(name)s %(levelname)s %(message)s", level=logging.INFO
)
log = logging.getLogger("ops-bot")

BOT_TOKEN = os.environ["OPS_TG_BOT_TOKEN"]
DEVIN_API_KEY = os.environ.get("DEVIN_API_KEY", "")
ADMIN_USER_IDS = {
    int(x) for x in os.environ.get("ADMIN_USER_IDS", "").split(",") if x.strip()
}
DB_PATH = os.environ.get("DB_PATH", "tickets.db")

DEVIN_API_BASE = "https://api.devin.ai/v1"

# Project name -> GitHub repo. Users can tag a message with #project.
PROJECTS = {
    "spark-im": "senbit5188-max/spark-im",
    "ark": "senbit5188-max/yumiren",
    "方舟": "senbit5188-max/yumiren",
    "aister": "senbit5188-max/AISTER",
    "xinw": "senbit5188-max/xinw",
}
DEFAULT_REPO = "senbit5188-max/spark-im"

FEEDBACK_PATTERNS = [
    r"报错", r"出错", r"错误", r"故障", r"崩溃", r"闪退", r"卡死", r"卡住",
    r"无法", r"不能", r"打不开", r"进不去", r"登录不了", r"登不上", r"连不上",
    r"失败", r"异常", r"白屏", r"黑屏", r"加载不出", r"收不到", r"发不出",
    r"没反应", r"不显示", r"丢失", r"掉线", r"很慢", r"太慢", r"延迟",
    r"bug", r"error", r"crash", r"fail", r"broken", r"issue",
    r"反馈", r"投诉", r"建议",
]
FEEDBACK_RE = re.compile("|".join(FEEDBACK_PATTERNS), re.IGNORECASE)


def db() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            created_at INTEGER,
            chat_id INTEGER,
            message_id INTEGER,
            user_name TEXT,
            text TEXT,
            project TEXT,
            status TEXT DEFAULT 'open',
            devin_session_id TEXT,
            devin_session_url TEXT
        )"""
    )
    return conn


def detect_project(text: str) -> str:
    lowered = text.lower()
    for name, repo in PROJECTS.items():
        if name.lower() in lowered:
            return repo
    return DEFAULT_REPO


def create_devin_session(prompt: str) -> dict:
    resp = requests.post(
        f"{DEVIN_API_BASE}/sessions",
        headers={"Authorization": f"Bearer {DEVIN_API_KEY}"},
        json={"prompt": prompt, "idempotent": False},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def is_admin(user_id: int) -> bool:
    return not ADMIN_USER_IDS or user_id in ADMIN_USER_IDS


async def cmd_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.effective_message.reply_text(
        "你好，我是运维客服 bot。\n"
        "把我拉进群后我会自动留意报错/反馈类消息并登记工单。\n\n"
        "命令：\n"
        "/tickets - 查看最近工单\n"
        "/fix <描述> - 直接创建 Devin 会话处理问题\n"
        "/help - 帮助"
    )


async def cmd_help(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await cmd_start(update, context)


async def cmd_tickets(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    conn = db()
    rows = conn.execute(
        "SELECT id, status, user_name, substr(text,1,60), devin_session_url "
        "FROM tickets ORDER BY id DESC LIMIT 10"
    ).fetchall()
    conn.close()
    if not rows:
        await update.effective_message.reply_text("暂无工单。")
        return
    lines = []
    for tid, status, user, text, url in rows:
        line = f"#{tid} [{status}] {user}: {text}"
        if url:
            line += f"\n  Devin: {url}"
        lines.append(line)
    await update.effective_message.reply_text("\n".join(lines))


async def cmd_fix(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    msg = update.effective_message
    if not is_admin(update.effective_user.id):
        await msg.reply_text("只有管理员可以使用 /fix。")
        return
    desc = " ".join(context.args) if context.args else ""
    if not desc and msg.reply_to_message and msg.reply_to_message.text:
        desc = msg.reply_to_message.text
    if not desc:
        await msg.reply_text("用法：/fix <问题描述>（或回复一条消息发 /fix）")
        return
    await spawn_devin(msg, desc, ticket_id=None)


async def spawn_devin(msg, desc: str, ticket_id: int | None) -> None:
    if not DEVIN_API_KEY:
        await msg.reply_text("未配置 DEVIN_API_KEY，无法创建 Devin 会话。")
        return
    repo = detect_project(desc)
    prompt = (
        f"用户在 Telegram 群反馈了以下问题，请在仓库 {repo} 中排查并修复，"
        f"必要时 SSH 到对应服务器查看日志。修复后创建 PR。\n\n"
        f"用户反馈：{desc}"
    )
    try:
        data = create_devin_session(prompt)
    except Exception as e:
        log.exception("Devin session creation failed")
        await msg.reply_text(f"创建 Devin 会话失败：{e}")
        return
    url = data.get("url", "")
    sid = data.get("session_id", "")
    if ticket_id is not None:
        conn = db()
        conn.execute(
            "UPDATE tickets SET status='processing', devin_session_id=?, "
            "devin_session_url=? WHERE id=?",
            (sid, url, ticket_id),
        )
        conn.commit()
        conn.close()
    await msg.reply_text(
        f"已创建 Devin 会话处理该问题（仓库 {repo}）：\n{url}"
    )


async def on_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    msg = update.effective_message
    if not msg or not msg.text:
        return
    text = msg.text
    if not FEEDBACK_RE.search(text):
        return
    user = update.effective_user
    user_name = user.full_name if user else "unknown"
    conn = db()
    cur = conn.execute(
        "INSERT INTO tickets (created_at, chat_id, message_id, user_name, text, project) "
        "VALUES (?,?,?,?,?,?)",
        (int(time.time()), msg.chat_id, msg.message_id, user_name, text,
         detect_project(text)),
    )
    ticket_id = cur.lastrowid
    conn.commit()
    conn.close()
    keyboard = InlineKeyboardMarkup(
        [[InlineKeyboardButton("创建 Devin 会话修复", callback_data=f"fix:{ticket_id}")]]
    )
    await msg.reply_html(
        f"已收到反馈，登记为工单 <b>#{ticket_id}</b>。\n"
        f"内容：{html.escape(text[:200])}",
        reply_markup=keyboard,
    )


async def on_button(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    if not is_admin(query.from_user.id):
        await query.message.reply_text("只有管理员可以触发 Devin 会话。")
        return
    ticket_id = int(query.data.split(":", 1)[1])
    conn = db()
    row = conn.execute(
        "SELECT text, devin_session_url FROM tickets WHERE id=?", (ticket_id,)
    ).fetchone()
    conn.close()
    if not row:
        await query.message.reply_text(f"找不到工单 #{ticket_id}。")
        return
    text, existing_url = row
    if existing_url:
        await query.message.reply_text(
            f"工单 #{ticket_id} 已有 Devin 会话：\n{existing_url}"
        )
        return
    await spawn_devin(query.message, text, ticket_id=ticket_id)


def main() -> None:
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CommandHandler("tickets", cmd_tickets))
    app.add_handler(CommandHandler("fix", cmd_fix))
    app.add_handler(CallbackQueryHandler(on_button, pattern=r"^fix:\d+$"))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, on_message))
    log.info("ops-bot starting (polling)")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
