/* eslint-disable @typescript-eslint/no-explicit-any */

import { ArenaScreenshotter } from '$lib/ArenaScreenshotter.js';
import { extractAccessToken } from '$lib/util.js';
import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export async function GET({ params, request }) {
	try {
		const accessToken = extractAccessToken(request);
		const arena = new ArenaScreenshotter(accessToken);
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
