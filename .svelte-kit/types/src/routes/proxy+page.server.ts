// @ts-nocheck
import { redirect } from "@sveltejs/kit";

import type { PageServerLoad } from "./$types";

export const load = async (event: Parameters<PageServerLoad>[0]) => {
	if (!event.locals.user) {
		return redirect(302, "/login");
	}
    return {
        user: event.locals.user,
        session: event.locals.session
    };
};