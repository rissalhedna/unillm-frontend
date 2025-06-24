import { deleteSessionTokenCookie, validateSessionToken } from '$lib/server/session';
import type { Handle } from '@sveltejs/kit';


export const handle: Handle = async ({ event, resolve }) => {
    if (
		event.url.pathname.startsWith(
			'/.well-known/appspecific/com.chrome.devtools'
		)
	) {
		return new Response(null, { status: 204 });
	}
    const sessionToken = event.cookies.get('session')

    if(!sessionToken){
        event.locals.user = null
        event.locals.session = null
        return resolve(event)
    }

    const {session, user} = await validateSessionToken(sessionToken)

    if(!session){
        deleteSessionTokenCookie(event)
    }

    event.locals.user = user
    event.locals.session = session

    const response = await resolve(event);
    return response;
}