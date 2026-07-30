import type { BigInteger } from "big-integer";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import { Api } from "telegram/tl";

export type AuthState = "unauthenticated" | "awaiting_code" | "authenticated";

export interface SessionStore {
	get(key: string): Promise<string | null | undefined>;
	put(key: string, value: string): Promise<void>;
	delete(key: string): Promise<void>;
}

interface TelegramError {
	errorMessage?: string;
	message: string;
}

function isTelegramError(error: unknown): error is TelegramError {
	return (
		typeof error === "object" &&
		error !== null &&
		"message" in error &&
		typeof (error as TelegramError).message === "string"
	);
}

export interface ContactResult {
	phone: string;
	registered: boolean;
	firstName?: string;
	lastName?: string;
	username?: string;
	phoneNumber?: string;
	status?: string;
	online?: boolean;
}

export class TelegramClientWrapper {
	private client: TelegramClient | null = null;
	private store: SessionStore;
	private apiId: number;
	private apiHash: string;
	private phoneNumber: string;

	constructor(
		store: SessionStore,
		apiId: number,
		apiHash: string,
		phoneNumber: string,
	) {
		this.store = store;
		this.apiId = apiId;
		this.apiHash = apiHash;
		this.phoneNumber = phoneNumber;
	}

	async initialize(): Promise<void> {
		const savedSession = await this.store.get("session");
		const session = new StringSession(savedSession || "");

		this.client = new TelegramClient(session, this.apiId, this.apiHash, {
			connectionRetries: 5,
		});

		await this.client.connect();

		const authorized = await this.client.isUserAuthorized();
		if (!authorized && savedSession) {
			await this.store.delete("session");
		}
	}

	async getState(): Promise<AuthState> {
		if (!this.client) return "unauthenticated";
		try {
			return (await this.client.isUserAuthorized())
				? "authenticated"
				: "unauthenticated";
		} catch (error) {
			if (
				isTelegramError(error) &&
				error.errorMessage === "AUTH_KEY_UNREGISTERED"
			) {
				await this.store.delete("session");
				return "unauthenticated";
			}
			throw error;
		}
	}

	async startAuth(): Promise<{ phoneCodeHash: string }> {
		if (!this.client) {
			throw new Error("Telegram client not initialized");
		}

		const result = await this.client.sendCode(
			{ apiId: this.apiId, apiHash: this.apiHash },
			this.phoneNumber,
		);

		await this.store.put("phoneCodeHash", result.phoneCodeHash);
		return { phoneCodeHash: result.phoneCodeHash };
	}

	async verifyCode(code: string, password?: string): Promise<void> {
		if (!this.client) {
			throw new Error("Telegram client not initialized");
		}

		const phoneCodeHash = await this.store.get("phoneCodeHash");
		if (!phoneCodeHash) {
			throw new Error("No authentication in progress");
		}

		try {
			await this.client.invoke(
				new Api.auth.SignIn({
					phoneNumber: this.phoneNumber,
					phoneCodeHash,
					phoneCode: code,
				}),
			);
		} catch (error) {
			if (
				isTelegramError(error) &&
				error.errorMessage === "SESSION_PASSWORD_NEEDED"
			) {
				if (!password) {
					throw new Error("2FA password required");
				}
				await this.client.signInWithPassword(
					{ apiId: this.apiId, apiHash: this.apiHash },
					{
						password: async () => password,
						onError: async (err) => {
							throw err;
						},
					},
				);
			} else {
				throw error;
			}
		}

		const stringSession = this.client.session as StringSession;
		const sessionString = stringSession.save();
		await this.store.put("session", sessionString);
		await this.store.delete("phoneCodeHash");
	}

	async importContacts(phones: string[]): Promise<ContactResult[]> {
		if (!this.client) {
			throw new Error("Telegram client not initialized");
		}

		const authorized = await this.client.isUserAuthorized();
		if (!authorized) {
			throw new Error("Not authenticated");
		}

		const MAX_PER_REQUEST = 200;
		if (phones.length > 1000) {
			throw new Error("Maximum 1000 phone numbers per request");
		}

		const allResults: ContactResult[] = [];

		for (let i = 0; i < phones.length; i += MAX_PER_REQUEST) {
			const chunk = phones.slice(i, i + MAX_PER_REQUEST);
			const inputContacts: Api.TypeInputContact[] = chunk.map(
				(phone, index) =>
					new Api.InputPhoneContact({
						clientId: BigInt(i + index) as unknown as BigInteger,
						phone,
						firstName: "",
						lastName: "",
					}),
			);

			const result = (await this.client.invoke(
				new Api.contacts.ImportContacts({ contacts: inputContacts }),
			)) as Api.contacts.ImportedContacts;

			const userMap = new Map<string, Api.User>();
			for (const rawUser of result.users) {
				if (rawUser.className === "User") {
					const user = rawUser as Api.User;
					userMap.set(user.id.toString(), user);
				}
			}

			const importedByClient = new Map<string, string>();
			for (const imported of result.imported) {
				if (imported.className === "ImportedContact") {
					const item = imported as Api.ImportedContact;
					importedByClient.set(
						item.clientId.toString(),
						item.userId.toString(),
					);
				}
			}

			for (const [index, phone] of chunk.entries()) {
				const clientId = BigInt(i + index).toString();
				const userId = importedByClient.get(clientId);
				const user = userId ? userMap.get(userId) : undefined;

				allResults.push({
					phone,
					registered: Boolean(user),
					firstName: user?.firstName,
					lastName: user?.lastName,
					username: user?.username,
					phoneNumber: user?.phone,
					status: user ? formatUserStatus(user.status) : undefined,
					online: user ? isOnline(user.status) : undefined,
				});
			}
		}

		return allResults;
	}
}

function formatUserStatus(
	status: Api.TypeUserStatus | undefined,
): string | undefined {
	if (!status) return "unknown";

	switch (status.className) {
		case "UserStatusOnline":
			return "online";
		case "UserStatusOffline": {
			const offline = status as Api.UserStatusOffline;
			return `last seen ${new Date(offline.wasOnline * 1000).toISOString()}`;
		}
		case "UserStatusRecently":
			return "recently";
		case "UserStatusLastWeek":
			return "last week";
		case "UserStatusLastMonth":
			return "last month";
		case "UserStatusEmpty":
			return "unknown";
		default:
			return "unknown";
	}
}

function isOnline(status: Api.TypeUserStatus | undefined): boolean {
	if (status?.className !== "UserStatusOnline") return false;
	const online = status as Api.UserStatusOnline;
	return online.expires > Math.floor(Date.now() / 1000);
}
