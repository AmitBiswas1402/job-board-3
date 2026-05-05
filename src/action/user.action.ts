import bcrypt from "bcryptjs";
import { auth, currentUser as getClerkUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

import { usersTable } from "@/db/schema";
import { db } from "@/lib/index";
import {
	clearSessionCookie,
	getSessionPayload,
	setSessionCookie,
	signSessionToken,
} from "@/lib/auth";

type SafeUser = {
	id: number;
	name: string;
	email: string;
	createdAt: Date;
	updatedAt: Date;
};

type RegisterUserInput = {
	name: string;
	email: string;
	password: string;
};

type LoginUserInput = {
	email: string;
	password: string;
};

type UpdateUserInput = {
	name?: string;
	email?: string;
};

type UpdatePasswordInput = {
	currentPassword: string;
	newPassword: string;
};

function toSafeUser(user: typeof usersTable.$inferSelect): SafeUser {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
}

function normalizeEmail(email: string): string {
	return email.trim().toLowerCase();
}

function validatePassword(password: string): void {
	if (password.length < 8) {
		throw new Error("Password must be at least 8 characters long.");
	}
}

export async function registerUser(input: RegisterUserInput): Promise<SafeUser> {
	const name = input.name.trim();
	const email = normalizeEmail(input.email);
	const password = input.password;

	if (!name) {
		throw new Error("Name is required.");
	}
	if (!email) {
		throw new Error("Email is required.");
	}
	validatePassword(password);

	const existing = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email))
		.limit(1);

	if (existing.length > 0) {
		throw new Error("An account with this email already exists.");
	}

	const passwordHash = await bcrypt.hash(password, 10);

	const inserted = await db
		.insert(usersTable)
		.values({
			name,
			email,
			password: passwordHash,
		})
		.returning();

	const createdUser = inserted[0];
	const token = await signSessionToken({
		sub: String(createdUser.id),
		email: createdUser.email,
		name: createdUser.name,
	});
	await setSessionCookie(token);

	return toSafeUser(createdUser);
}

export async function loginUser(input: LoginUserInput): Promise<SafeUser> {
	const email = normalizeEmail(input.email);
	const password = input.password;

	if (!email || !password) {
		throw new Error("Email and password are required.");
	}

	const users = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email))
		.limit(1);

	const user = users[0];
	if (!user) {
		throw new Error("Invalid email or password.");
	}

	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		throw new Error("Invalid email or password.");
	}

	const token = await signSessionToken({
		sub: String(user.id),
		email: user.email,
		name: user.name,
	});
	await setSessionCookie(token);

	return toSafeUser(user);
}

export async function logoutUser(): Promise<void> {
	await clearSessionCookie();
}

async function syncClerkUserToDb(): Promise<SafeUser | null> {
	const authData = await auth();
	if (!authData.userId) {
		return null;
	}

	const clerkUser = await getClerkUser();
	if (!clerkUser?.emailAddresses?.[0]?.emailAddress) {
		return null;
	}

	const email = normalizeEmail(clerkUser.emailAddresses[0].emailAddress);
	const name =
		[clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ").trim() ||
		clerkUser.username ||
		email.split("@")[0] ||
		"User";

	const existing = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.email, email))
		.limit(1);

	if (existing[0]) {
		const updated = await db
			.update(usersTable)
			.set({ name, updatedAt: new Date() })
			.where(eq(usersTable.id, existing[0].id))
			.returning();
		return toSafeUser(updated[0]);
	}

	const placeholderPassword = await bcrypt.hash(
		`clerk:${authData.userId}:${process.env.AUTH_SECRET ?? "dev"}`,
		10
	);

	const inserted = await db
		.insert(usersTable)
		.values({ name, email, password: placeholderPassword })
		.returning();

	return toSafeUser(inserted[0]);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
	const session = await getSessionPayload();
	if (session?.sub) {
		const userId = Number(session.sub);
		if (Number.isFinite(userId)) {
			const users = await db
				.select()
				.from(usersTable)
				.where(eq(usersTable.id, userId))
				.limit(1);

			const user = users[0];
			if (user) {
				return toSafeUser(user);
			}
		}
	}

	return await syncClerkUserToDb();
}

export async function requireAuthenticatedUser(): Promise<SafeUser> {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("Unauthorized");
	}
	return user;
}

export async function updateCurrentUser(input: UpdateUserInput): Promise<SafeUser> {
	const authUser = await requireAuthenticatedUser();

	const updates: Partial<typeof usersTable.$inferInsert> = {};

	if (typeof input.name === "string") {
		const name = input.name.trim();
		if (!name) {
			throw new Error("Name cannot be empty.");
		}
		updates.name = name;
	}

	if (typeof input.email === "string") {
		const email = normalizeEmail(input.email);
		if (!email) {
			throw new Error("Email cannot be empty.");
		}

		const existing = await db
			.select()
			.from(usersTable)
			.where(eq(usersTable.email, email))
			.limit(1);

		if (existing[0] && existing[0].id !== authUser.id) {
			throw new Error("Another account already uses this email.");
		}

		updates.email = email;
	}

	if (Object.keys(updates).length === 0) {
		return authUser;
	}

	const updated = await db
		.update(usersTable)
		.set({ ...updates, updatedAt: new Date() })
		.where(eq(usersTable.id, authUser.id))
		.returning();

	const user = updated[0];

	const token = await signSessionToken({
		sub: String(user.id),
		email: user.email,
		name: user.name,
	});
	await setSessionCookie(token);

	return toSafeUser(user);
}

export async function updateCurrentUserPassword(
	input: UpdatePasswordInput
): Promise<void> {
	const authUser = await requireAuthenticatedUser();
	validatePassword(input.newPassword);

	const users = await db
		.select()
		.from(usersTable)
		.where(eq(usersTable.id, authUser.id))
		.limit(1);

	const user = users[0];
	if (!user) {
		throw new Error("User not found.");
	}

	const matches = await bcrypt.compare(input.currentPassword, user.password);
	if (!matches) {
		throw new Error("Current password is incorrect.");
	}

	const nextHash = await bcrypt.hash(input.newPassword, 10);

	await db
		.update(usersTable)
		.set({ password: nextHash, updatedAt: new Date() })
		.where(eq(usersTable.id, authUser.id));
}
