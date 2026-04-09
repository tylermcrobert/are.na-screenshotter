import { json } from '@sveltejs/kit';
import z from 'zod';
import { handleApiError } from '$lib/api.js';

const BASE_64_REGEX = /^data:([A-Za-z-+/]+);base64,/;

export async function POST({ request, params: { slug } }) {
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

		const mimeType = body.asset.match(BASE_64_REGEX)?.[1] || 'image/png';
		const extension = mimeType.split('/')[1] || 'png';

		const presignResponse = await fetch(
			'https://api.are.na/v3/uploads/presign',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: authHeader
				},
				body: JSON.stringify({
					files: [
						{ filename: `screenshot.${extension}`, content_type: mimeType }
					]
				})
			}
		);

		const presignData = await presignResponse.json();

		if (!presignResponse.ok) {
			throw new Error(
				presignData.details?.message ||
					presignData.error ||
					'Failed to get presigned URL'
			);
		}

		const { upload_url, key, content_type } = presignData.files[0];

		const base64Data = body.asset.replace(BASE_64_REGEX, '');
		const buffer = Buffer.from(base64Data, 'base64');

		const uploadResponse = await fetch(upload_url, {
			method: 'PUT',
			headers: { 'Content-Type': content_type },
			body: buffer
		});

		if (!uploadResponse.ok) {
			throw new Error('Failed to upload screenshot to storage');
		}

		const s3Url = `https://s3.amazonaws.com/arena_images-temp/${key}`;

		const arenaResponse = await fetch('https://api.are.na/v3/blocks', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: authHeader
			},
			body: JSON.stringify({
				value: s3Url,
				title: body.title,
				original_source_url: body.url,
				original_source_title: body.title,
				channel_ids: [slug]
			})
		});

		const arenaJson = await arenaResponse.json();

		if (!arenaResponse.ok) {
			throw new Error(
				arenaJson.details?.message ||
					arenaJson.error ||
					'Failed to create block'
			);
		}

		return json({ id: arenaJson.id }, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}
