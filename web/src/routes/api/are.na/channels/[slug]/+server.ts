/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';
import { uploadBase64Image } from '$lib';
import { ArenaScreenshotter } from '$lib/ArenaScreenshotter.js';
import { json } from '@sveltejs/kit';
import z, { ZodError } from 'zod';

export async function POST({ request, params }) {
	try {
		const body = z
			.object({
				screenshot: z.string(),
				url: z.string(),
				title: z.string()
			})
			.parse(await request.json());

		const gcsFile = await uploadBase64Image(body.screenshot);

		const arena = new ArenaScreenshotter(ARENA_PERSONAL_ACCESS_TOKEN);
		const item = await arena.postItem(params.slug, {
			source: `https://arena-screenshotter.com/api/redirect?asset=${gcsFile.publicUrl()}&redirect=${body.url}&timestamp=${new Date().getTime()}`,
			pageTitle: body.title,
			pageUrl: body.url
		});

		return json(item, { status: 200 });
	} catch (error) {
		if (error instanceof ZodError) {
			return json(
				{ success: false, error: `${error.errors[0].message}` },
				{ status: 400 }
			);
		}

		return json(
			{ success: false, error: (error as any).message },
			{ status: 500 }
		);
	}
}
