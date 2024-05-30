/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';
import { postItem, uploadBase64Image } from '$lib';
import { json } from '@sveltejs/kit';
import z from 'zod';

export async function POST({ request, params }) {
	try {
		const body = z
			.object({
				screenshot: z.string(),
				description: z.string(),
				title: z.string()
			})
			.parse(await request.json());

		const gcsFile = await uploadBase64Image(body.screenshot);

		const arenaResponse = await postItem({
			channelId: params.slug,
			source: gcsFile.publicUrl(),
			title: body.title,
			description: body.description,
			token: ARENA_PERSONAL_ACCESS_TOKEN
		});

		const response = {
			success: true,
			data: { ...arenaResponse }
		};

		return json(response, { status: 200 });
	} catch (error) {
		console.error(error);

		return json(
			{ success: false, error: (error as any).message },
			{ status: 500 }
		);
	}
}
