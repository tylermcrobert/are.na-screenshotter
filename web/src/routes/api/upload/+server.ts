/* eslint-disable @typescript-eslint/no-explicit-any */

import { getDataFromBase64, uploadGCSFile } from '$lib';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	try {
		const { image } = await request.json();

		// Check if an image was provided

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

		// Get the buffer and filename from the base64 image
		const { buffer, filename } = getDataFromBase64(image);

		// Upload the image to Google Cloud Storage
		const { publicUrl } = await uploadGCSFile(buffer, {
			filename: filename
		});

		// Return the public URL of the uploaded image
		const apiResponse = {
			success: true,
			data: { publicUrl }
		};

		return json(apiResponse, { status: 200 });
	} catch (error) {
		console.log(error);

		return json(
			{ success: false, error: (error as any).message },
			{ status: 500 }
		);
	}
}
