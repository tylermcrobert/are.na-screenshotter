/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_SECRET } from '$env/static/private';
import { apiError, handleApiError } from '$lib/util.js';
import { json } from '@sveltejs/kit';
import z from 'zod';

export async function POST({ url }) {
	try {
		const { client_id, code, redirect_uri } = z
			.object({
				client_id: z.string({ message: 'client_id paramater is required.' }),
				code: z.string({ message: 'code paramater is required.' }),
				redirect_uri: z.string({
					message: 'redirect_uri paramater is required.'
				})
			})
			.parse(Object.fromEntries(url.searchParams));

		const authUrl = `https://dev.are.na/oauth/token?client_id=${client_id}&client_secret=${ARENA_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${redirect_uri}`;

		const response = await fetch(authUrl, {
			method: 'POST'
		});

		const authResponse = await response.json();

		if (!response.ok) {
			console.log(authResponse);
			return apiError('Could not get access token', response.status);
		}

		const fetchUserUrl = `https://api.are.na/v2/me?access_token=${authResponse.access_token}`;
		const userResponse = await fetch(fetchUserUrl);
		const userData = await userResponse.json();

		if (!userResponse.ok) {
			return apiError('Could not fetch user information', userResponse.status);
		}

		return json({ ...authResponse, user: userData.slug }, { status: 200 });
	} catch (error: any) {
		return handleApiError(error);
	}
}
