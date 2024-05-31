/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';
import { searchChannels } from '$lib';
import { json } from '@sveltejs/kit';
import z from 'zod';

export async function GET({ url }) {
	try {
		const params = z
			.object({
				q: z.string().min(0, 'Search query is required')
			})
			.parse(Object.fromEntries(url.searchParams));

		const apiRes = await searchChannels({
			q: params.q,
			token: ARENA_PERSONAL_ACCESS_TOKEN
		});

		return json(apiRes, { status: 200 });
	} catch (error) {
		console.error(error);

		return json(
			{ success: false, error: (error as any).message },
			{ status: 500 }
		);
	}
}
