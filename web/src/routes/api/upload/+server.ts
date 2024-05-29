/* eslint-disable @typescript-eslint/no-explicit-any */

import { base64toGCS } from '$lib';
import { json } from '@sveltejs/kit';

/**
 * Handles the POST request for uploading an image.
 *
 * @param {Object} request - The request object.
 * @returns {Promise<Object>} - A promise that resolves to the response object.
 */

export async function POST({ request }) {
	try {
		const { image } = await request.json();

		/**
		 * Check if the image is provided and is a base64 string.
		 */

		if (!image) {
			return json(
				{ success: false, error: 'No image provided' },
				{ status: 400 }
			);
		}

		if (!image.startsWith('data:image/')) {
			return json(
				{ success: false, error: 'Invalid image format' },
				{ status: 400 }
			);
		}

		/**
		 * Return the public URL of the uploaded image
		 */

		const upload = await base64toGCS(image);

		const response = {
			success: true,
			data: {
				publicUrl: upload.publicUrl()
			}
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
