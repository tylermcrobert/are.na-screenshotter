/* eslint-disable @typescript-eslint/no-explicit-any */

import { handleApiError } from '$lib/api.js';
import { z } from 'zod';

export async function GET({ url }) {
	try {
		const data = z
			.object({
				redirect: z.string({ message: 'redirect paramater is required.' }),
				asset: z.string({ message: 'asset paramater is required.' }),
				timestamp: z.coerce.number({
					message: 'timestamp paramater is required.'
				})
			})
			.parse(Object.fromEntries(url.searchParams));

		const timestamp = data.timestamp;
		const currentTime = new Date().getTime();
		const thirtySeconds = 30 * 1000;
		const isThirtySecondsOld = currentTime - timestamp > thirtySeconds;

		if (isThirtySecondsOld) {
			return new Response(null, {
				status: 302,
				headers: {
					Location: data.redirect
				}
			});
		}

		const response = await fetch(data.asset);
		const imageData = await response.arrayBuffer();
		const contentType = response.headers.get('content-type') || '';

		return new Response(imageData, {
			headers: {
				'Content-Type': contentType
			}
		});
	} catch (error) {
		return handleApiError(error);
	}
}
