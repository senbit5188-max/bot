# Telegram 联系人注册查询

一个运行在 Cloudflare Workers 上的 Telegram 联系人注册/在线状态查询工具。

## 功能

- 使用 Telegram MTProto 登录你的账号。
- 通过 `contacts.importContacts` 批量查询手机号是否已注册 Telegram。
- 返回注册用户的 Telegram 名称、用户名和在线状态。
- 支持 CSV/列表和号段两种输入方式，单次最多 1000 个号码。

## 环境要求

- Node.js >= 20
- Cloudflare 账号
- Telegram api_id / api_hash（从 https://my.telegram.org/apps 获取）
- 一个用于登录的 Telegram 手机号

## 本地开发

```bash
cd tg-contact-checker
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars 填入你的 Telegram 凭据
npm install
npm run dev
```

访问 `http://127.0.0.1:8788/auth/`。

## 部署

```bash
npx wrangler secret put TELEGRAM_API_ID
npx wrangler secret put TELEGRAM_API_HASH
npx wrangler secret put TELEGRAM_PHONE
# 必须设置访问路径（用于保护 Worker URL）
npx wrangler secret put AUTH_SECRET_PATH

npm run deploy
```

部署后访问 `https://tg-contact-checker.<account>.workers.dev/<AUTH_SECRET_PATH>/`。

## 安全提示

- `TELEGRAM_API_HASH` 和 `TELEGRAM_PHONE` 已通过 `wrangler secret` 加密存储。
- `AUTH_SECRET_PATH` 必须设置为随机字符串，用于保护 Worker URL 不被他人滥用。
- 该工具会调用 Telegram 的 `contacts.importContacts`；请仅用于你自己的联系人，遵守 Telegram 使用条款。
