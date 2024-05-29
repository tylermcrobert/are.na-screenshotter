/* eslint-disable @typescript-eslint/no-explicit-any */
import { snippetsBucket } from '$lib/gcs.js';
import { json } from '@sveltejs/kit';
import { v4 } from 'uuid';

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
		 * Get the buffer and filename from the base64 image string.
		 */
		const buffer = createBuffer(image);
		const filename = getFilename(image);

		/**
		 * Upload the image to Google Cloud Storage
		 */
		const gcsFile = snippetsBucket.file(filename);
		await gcsFile.save(buffer);

		/**
		 * Return the public URL of the uploaded image
		 */

		const response = {
			success: true,
			data: {
				publicUrl: gcsFile.publicUrl()
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

const BASE_64_REGEX = /^data:([A-Za-z-+/]+);base64,/;

/**
 * Converts a base64 string to a buffer.
 */
function createBuffer(base64String: string) {
	const base64Data = base64String.replace(BASE_64_REGEX, '');
	const buffer = Buffer.from(base64Data, 'base64');
	return buffer;
}

/**
 * Generates a unique filename for a given base64 string.
 */
function getFilename(base64String: string) {
	const mimeType = base64String.match(BASE_64_REGEX)?.[1];

	if (!mimeType) {
		throw new Error('Invalid base64 string');
	}

	const extension = mimeType.split('/')[1];

	return `${v4()}.${extension}`;
}
