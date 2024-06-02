import { API_ORIGIN_WHITELIST } from '$env/static/private';
import { uploadBase64Image } from '$lib/upload';
import { json } from '@sveltejs/kit';
import z from 'zod';
import { handleApiError } from '$lib/util.js';

export async function POST({ request }) {
	try {
		const { headers } = request;

		if (headers.get('origin') !== API_ORIGIN_WHITELIST) {
			return json({ message: 'Unauthorized origin' }, { status: 403 });
		}

		const body = z
			.object({
				screenshot: z
					.string()
					.min(1, { message: 'Base64 screenshot is required' })
			})
			.parse(await request.json());

		const gcsFile = await uploadBase64Image(body.screenshot);

		return json({ assetUrl: gcsFile.publicUrl() }, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}
