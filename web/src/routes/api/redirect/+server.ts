/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Redirect API (for older blocks)
 *
 * This used to both upload to GCS and if older than 60 seconds, redirect to the archive.org URL.
 * It is now just a redirect to the archive.org URL.
 *
 * ⚠️ Do not remove this, it is still used for older blocks.
 */
import { handleApiError } from '$lib/api.js';
import { z } from 'zod';

export async function GET({ url }) {
	try {
		const data = z
			.object({
				redirect: z.string({ message: 'redirect paramater is required.' })
			})
			.parse(Object.fromEntries(url.searchParams));

		return new Response(null, {
			status: 302,
			headers: {
				Location: data.redirect
			}
		});
	} catch (error) {
		return handleApiError(error);
	}
}
