// import { API_ORIGIN_WHITELIST } from '$env/static/private';
import { uploadBase64Image } from '$lib/upload';
import { json } from '@sveltejs/kit';
import z from 'zod';
import { handleApiError } from '$lib/api.js';

export async function POST({ request, params: { slug } }) {
	console.log('headers', request.headers.get('Authorization'), request.headers);

	try {
		const body = z
			.object({
				asset: z.string({ message: 'Base64 screenshot is required' }),
				url: z.string({ message: 'Host is required' }),
				title: z.string({ message: 'title is required' })
			})
			.parse(await request.json());

		const authHeader = request.headers.get('Authorization');

		if (!authHeader) {
			return json(
				{ error: true, message: 'Authorization header is required' },
				{ status: 401 }
			);
		}

		const gcsFile = await uploadBase64Image(body.asset);
		const publicUrl = gcsFile.publicUrl();

		const sourceUrl = `https://arena-screenshotter.com/api/redirect?asset=${publicUrl}&redirect=${encodeURIComponent(body.url)}&timestamp=${new Date().getTime()}`;
		console.log(sourceUrl);

		const apiUrl = `https://api.are.na/v3/blocks`;

		const arenaResponse = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: authHeader
			},
			body: JSON.stringify({
				value: sourceUrl,
				title: body.title,
				description: body.url,
				channel_ids: [slug]
			})
		});

		const arenaJson = await arenaResponse.json();

		if (!arenaResponse.ok) {
			throw new Error(arenaJson.details?.message ?? arenaJson.error);
		}

		const apiResponse = {
			id: arenaJson.id
		};

		return json(apiResponse, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}
