/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from '@sveltejs/kit';
import { ZodError, z } from 'zod';

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
		const oneSecond = 1 * 1000;
		const isOneMinuteOld = currentTime - timestamp > oneSecond;

		if (isOneMinuteOld) {
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
				'Content-Type': contentType,
				'Cache-Control': 'max-age=31536000' // 1 year
			}
		});
	} catch (error) {
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
