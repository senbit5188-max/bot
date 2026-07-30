import { DurableObject } from "cloudflare:workers";
import { indexHtml } from "./ui";
import { TelegramClientWrapper, type SessionStore } from "./telegram-client";

class DurableObjectStorageStore implements SessionStore {
	constructor(private storage: DurableObjectStorage) {}

	async get(key: string): Promise<string | null | undefined> {
		const value = await this.storage.get(key);
		return typeof value === "string" ? value : null;
	}

	async put(key: string, value: string): Promise<void> {
		await this.storage.put(key, value);
	}

	async delete(key: string): Promise<void> {
		await this.storage.delete(key);
	}
}

export class TelegramSession extends DurableObject<Env> {
	private store: SessionStore;
	private client: TelegramClientWrapper | null = null;
	private initialized = false;

	constructor(state: DurableObjectState, env: Env) {
		super(state, env);
		this.store = new DurableObjectStorageStore(this.ctx.storage);
		this.ctx.blockConcurrencyWhile(async () => {
			await this.initialize();
		});
	}

	async initialize(): Promise<void> {
		if (this.initialized) return;

		const apiId = Number.parseInt(this.env.TELEGRAM_API_ID, 10);
		const apiHash = this.env.TELEGRAM_API_HASH;
		const phoneNumber = this.env.TELEGRAM_PHONE;

		if (!apiId || !apiHash || !phoneNumber) {
			throw new Error("Missing Telegram credentials in environment");
		}

		this.client = new TelegramClientWrapper(
			this.store,
			apiId,
			apiHash,
			phoneNumber,
		);
		await this.client.initialize();
		this.initialized = true;
	}

	async fetch(request: Request): Promise<Response> {
		if (!this.client) {
			return json({ error: "Client not initialized" }, 500);
		}

		const url = new URL(request.url);

		try {
			if (url.pathname === "/api/auth/status" && request.method === "GET") {
				const state = await this.client.getState();
				return json({ state });
			}

			if (url.pathname === "/api/auth/start" && request.method === "POST") {
				const result = await this.client.startAuth();
				return json({ sent: true, phoneCodeHash: result.phoneCodeHash });
			}

			if (url.pathname === "/api/auth/verify" && request.method === "POST") {
				const body = (await request.json()) as {
					code?: string;
					password?: string;
				};
				if (!body.code) {
					return json({ error: "Code is required" }, 400);
				}
				await this.client.verifyCode(body.code, body.password);
				return json({ success: true, state: "authenticated" });
			}

			if (
				url.pathname === "/api/contacts/import" &&
				request.method === "POST"
			) {
				const body = (await request.json()) as {
					phones?: string[];
					csv?: string;
					range?: string;
					prefix?: string;
				};

				const phones = parsePhones(body);
				if (phones.length === 0) {
					return json({ error: "No valid phone numbers provided" }, 400);
				}
				if (phones.length > 1000) {
					return json({ error: "Maximum 1000 phone numbers per request" }, 400);
				}

				const results = await this.client.importContacts(phones);
				return json({ count: results.length, results });
			}

			return json({ error: "Not found" }, 404);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unknown error";
			return json({ error: message }, 500);
		}
	}
}

function parsePhones(body: {
	phones?: string[];
	csv?: string;
	range?: string;
	prefix?: string;
}): string[] {
	const phones: string[] = [];

	if (Array.isArray(body.phones)) {
		for (const phone of body.phones) {
			const normalized = normalizePhone(phone, body.prefix);
			if (normalized) phones.push(normalized);
		}
	}

	if (typeof body.csv === "string" && body.csv.length > 0) {
		for (const raw of body.csv.split(/[\n,]+/)) {
			const normalized = normalizePhone(raw, body.prefix);
			if (normalized) phones.push(normalized);
		}
	}

	if (typeof body.range === "string" && body.range.includes("-")) {
		const [start, end] = body.range.split("-", 2);
		const startNum = Number.parseInt(start.trim(), 10);
		const endNum = Number.parseInt(end.trim(), 10);

		if (!Number.isNaN(startNum) && !Number.isNaN(endNum)) {
			const prefix = body.prefix || "";
			const lower = Math.min(startNum, endNum);
			const upper = Math.max(startNum, endNum);
			if (upper - lower > 1000) {
				throw new Error("Range spans more than 1000 numbers");
			}
			for (let i = lower; i <= upper; i++) {
				phones.push(`${prefix}${i}`);
			}
		}
	}

	return [...new Set(phones)];
}

function normalizePhone(raw: string, prefix = ""): string | null {
	let phone = raw.trim().replace(/[\s\-()]/g, "");
	if (!phone) return null;
	if (!phone.startsWith("+") && !phone.startsWith("00")) {
		phone = prefix ? `${prefix}${phone}` : phone;
	}
	return phone;
}

function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: { "Content-Type": "application/json" },
	});
}

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext) {
		const url = new URL(request.url);
		if (!env.AUTH_SECRET_PATH) {
			return new Response("AUTH_SECRET_PATH not configured", { status: 500 });
		}
		const authPath = `/${env.AUTH_SECRET_PATH}`;

		if (url.pathname === authPath) {
			return Response.redirect(`${url.toString()}/`, 302);
		}

		if (
			url.pathname === `${authPath}/` ||
			url.pathname === `${authPath}/index.html`
		) {
			return new Response(indexHtml, {
				headers: { "Content-Type": "text/html; charset=utf-8" },
			});
		}

		if (url.pathname.startsWith(`${authPath}/api/`)) {
			const newPath = url.pathname.slice(authPath.length);
			const newUrl = new URL(newPath, request.url);
			const apiRequest = new Request(newUrl, request);

			const id = env.TELEGRAM_SESSION.idFromName("global");
			const stub = env.TELEGRAM_SESSION.get(id);
			return stub.fetch(apiRequest);
		}

		return new Response("Not found", { status: 404 });
	},
};
