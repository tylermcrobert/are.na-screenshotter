/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';
import { ArenaScreenshotter } from '$lib/ArenaScreenshotter';
import { json } from '@sveltejs/kit';
import z, { ZodError } from 'zod';

export async function GET({ url }) {
	try {
		const params = z
			.object({ q: z.string().min(1, { message: 'Search query is required' }) })
			.parse(Object.fromEntries(url.searchParams));

		const arena = new ArenaScreenshotter(ARENA_PERSONAL_ACCESS_TOKEN);
		const userChannels = await arena.searchChannels(params.q, {
			userSlug: 'tyler-mcrobert'
		});

		return json(userChannels, { status: 200 });
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
