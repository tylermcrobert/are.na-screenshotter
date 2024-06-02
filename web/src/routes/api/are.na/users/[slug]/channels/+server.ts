import { ArenaScreenshotter } from '$lib/ArenaScreenshotter.js';
import { extractAccessToken, handleApiError } from '$lib/util.js';
import { json } from '@sveltejs/kit';

export async function GET({ params, request }) {
	try {
		const accessToken = extractAccessToken(request);
		const arena = new ArenaScreenshotter(accessToken);
		const userChannels = await arena.getUserChannels(params.slug);

		return json(userChannels, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}
