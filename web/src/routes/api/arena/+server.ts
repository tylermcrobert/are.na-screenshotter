/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';
import { postItem } from '$lib';
import { json } from '@sveltejs/kit';

export async function POST() {
	try {
		const arenaResponse = await postItem({
			channelId: 'tests-twjgqznfouc',
			source:
				'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL2nnM2tOVMLht00mgSaYOOKpJGxY_9UA5MQ&s',
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
