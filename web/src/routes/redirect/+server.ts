/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from '@sveltejs/kit';
import { ZodError, z } from 'zod';

export async function GET({ request, url }) {
	const isBot = !!request.headers.get('x-forwarded-for');

	try {
		const data = z
			.object({
				redirect: z.string({ message: 'redirect paramater is required.' }),
				assetId: z.string({ message: 'assetId paramater is required.' })
			})
			.parse(Object.fromEntries(url.searchParams));

		const screenshotPublicUrl = `https://storage.googleapis.com/are-na-screenshots/${data.assetId}`;

		const response = {
			success: true,
			data: {
				isBot,
				screenshotPublicUrl,
				redirect: data.redirect
			}
		};

		return json(response, { status: 200 });
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
