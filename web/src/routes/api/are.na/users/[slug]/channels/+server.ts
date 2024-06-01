/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';
import { ArenaScreenshotter } from '$lib/ArenaScreenshotter.js';
import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export async function GET({ params }) {
	try {
		const arena = new ArenaScreenshotter(ARENA_PERSONAL_ACCESS_TOKEN);
		const userChannels = await arena.getUserChannels(params.slug);

		return json(userChannels, { status: 200 });
	} catch (error) {
		console.error(error);

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
