/* eslint-disable @typescript-eslint/no-explicit-any */

import { ARENA_SECRET } from '$env/static/private';
import { apiError, handleApiError } from '$lib/api.js';
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

		const response = await fetch('https://api.are.na/v3/oauth/token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				grant_type: 'authorization_code',
				client_id,
				client_secret: ARENA_SECRET,
				code,
				redirect_uri
			})
		});

		const authResponse = await response.json();

		if (!response.ok) {
			console.log(authResponse);
			return apiError('Could not get access token', response.status);
		}

		const userResponse = await fetch('https://api.are.na/v3/me', {
			headers: { Authorization: `Bearer ${authResponse.access_token}` }
		});
		const userData = await userResponse.json();

		if (!userResponse.ok) {
			return apiError('Could not fetch user information', userResponse.status);
		}

		return json({ ...authResponse, user: userData.slug }, { status: 200 });
	} catch (error: any) {
		return handleApiError(error);
	}
}
