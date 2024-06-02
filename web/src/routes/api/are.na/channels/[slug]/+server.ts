import { uploadBase64Image } from '$lib/upload';
import { ArenaScreenshotter } from '$lib/ArenaScreenshotter.js';
import { json } from '@sveltejs/kit';
import z from 'zod';
import { extractAccessToken, handleApiError } from '$lib/util.js';

export async function POST({ request, params }) {
	try {
		const body = z
			.object({
				screenshot: z
					.string()
					.min(1, { message: 'Base64 screenshot is required' }),
				originUrl: z.string().min(1, { message: 'URL is required' }),
				originTitle: z.string().min(1, { message: 'Title is required' })
			})
			.parse(await request.json());

		const gcsFile = await uploadBase64Image(body.screenshot);

		const accessToken = extractAccessToken(request);
		const arena = new ArenaScreenshotter(accessToken);

		const item = await arena.postItem(params.slug, {
			source: `https://arena-screenshotter.com/api/redirect?asset=${gcsFile.publicUrl()}&redirect=${body.originUrl}&timestamp=${new Date().getTime()}`,
			originTitle: body.originTitle,
			originUrl: body.originUrl
		});

		return json(item, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}
