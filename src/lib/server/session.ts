import prisma from "$lib/server/db";
import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type {Session} from "@prisma/client"
import type { RequestEvent } from "@sveltejs/kit";

export async function validateSessionToken(token: string){
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

	const session = await prisma.session.findUnique(
		{
			where:{
				id: sessionId
			},
			include: { user:true }
		}
	)

	if(!session){
		return {session: null, user: null}
	} 
	if (Date.now() >= session.expiresAt.getTime()) {
		await prisma.session.delete({
			where:{
				id:sessionId
			}
		})
		return {session: null, user: null}
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await prisma.session.update({
			where: {
				id: session.id
			},
			data: {
				expiresAt: session.expiresAt
			}
		});
	}
	return {session: session, user: session.user}
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await prisma.session.delete({
		where: {
			id: sessionId
		}
	});
}

export async function invalidateUserSessions(userId: string): Promise<void> {
	await prisma.session.deleteMany({
		where: {
			userId
		}
	});
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date): void {
	event.cookies.set("session", token, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: expiresAt
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const now = Date.now()
	const session = await prisma.session.create({
		data: {
			id: sessionId,
			userId: userId,
			expiresAt: new Date(now + 1000 * 60 * 60 * 24 * 30),
			createdAt: new Date(now),
			updatedAt: new Date(now)
		}
	});
	return session;
}

export async function getUserBySession(sessionId: string) {
	const session = await prisma.session.findUnique({
		where: { id: sessionId },
		include: { user: true }
	});
	
	return session?.user || null;
}