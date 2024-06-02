import { ArenaScreenshotter } from '$lib/ArenaScreenshotter';
import { extractAccessToken, handleApiError } from '$lib/util.js';
import { json } from '@sveltejs/kit';
import z from 'zod';

export async function GET({ url, request }) {
	try {
		const params = z
			.object({
				q: z.string().min(1, { message: 'Search query is required' }),
				user: z.string().min(1, { message: 'User slug is required' })
			})

			.parse(Object.fromEntries(url.searchParams));

		const accessToken = extractAccessToken(request);

		const arena = new ArenaScreenshotter(accessToken);
		const userChannels = await arena.searchUserChannels({
			q: params.q,
			user: params.user
		});

		return json(userChannels, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}
