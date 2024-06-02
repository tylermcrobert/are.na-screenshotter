/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_SECRET } from '$env/static/private';
import { handleApiError } from '$lib/util.js';
import { json } from '@sveltejs/kit';
import z from 'zod';

export async function POST({ url }) {
	try {
		const { client_id, code, redirect_uri } = z
			.object({
				client_id: z.string(),
				code: z.string(),
				redirect_uri: z.string()
			})
			.parse(Object.fromEntries(url.searchParams));

		const authUrl = `https://dev.are.na/oauth/token?client_id=${client_id}&client_secret=${ARENA_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;

		const response = await fetch(authUrl, {
			method: 'POST'
		});

		const data = await response.json();

		if (!response.ok) {
			return json(data, { status: response.status });
		}

		return json(data, { status: 200 });
	} catch (error: any) {
		return handleApiError(error);
	}
}
