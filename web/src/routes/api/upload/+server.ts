/* eslint-disable @typescript-eslint/no-explicit-any */

import { generateFilename, getDataFromBase64, uploadGCSFile } from '$lib';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	console.log('POST /api/upload');

	try {
		const { image } = await request.json();

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

		const { buffer, fileType } = getDataFromBase64(image);

		const randomFilename = generateFilename(fileType);

		const { id, publicUrl } = await uploadGCSFile(buffer, {
			filename: randomFilename
		});

		const response = {
			success: true,
			data: {
				id,
				publicUrl
			}
		};

		return json(response, { status: 200 });
	} catch (error) {
		console.log(error);

		return json(
			{ success: false, error: (error as any).message },
			{ status: 500 }
		);
	}
}
