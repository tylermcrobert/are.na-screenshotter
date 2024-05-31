/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';
import { getUserChannels } from '$lib';
import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export async function GET({ params }) {
	try {
		const arenaResponse = await getUserChannels({
			token: ARENA_PERSONAL_ACCESS_TOKEN,
			userId: params.slug
		});

		const response = {
			success: true,
			data: { ...arenaResponse }
		};

		return json(response, { status: 200 });
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
