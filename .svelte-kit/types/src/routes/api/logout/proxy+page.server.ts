// @ts-nocheck
import { fail, redirect } from "@sveltejs/kit";
import { invalidateSession, deleteSessionTokenCookie } from "$lib/server/session";

import type { Actions, PageServerLoad } from "./$types";

export const load = async ({ locals }: Parameters<PageServerLoad>[0]) => {
	console.log("User logging out: ", locals.user?.name)
};

export const actions = {
	default: async (event: import('./$types').RequestEvent) => {
		if (event.locals.session === null) {
			return fail(401);
		}
		await invalidateSession(event.locals.session.id);
		deleteSessionTokenCookie(event);
		return redirect(302, "/login");
	}
};;null as any as Actions;