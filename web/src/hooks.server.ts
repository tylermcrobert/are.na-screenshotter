import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	if (event.url.pathname.startsWith('/api')) {
		// response.headers.append(
		// 	'Access-Control-Allow-Methods',
		// 	'GET, POST, PUT, DELETE, PATCH, OPTIONS'
		// );
		response.headers.append('Access-Control-Allow-Origin', `*`);
		response.headers.append('Access-Control-Allow-Headers', `*`);
	}

	return response;
};
