/* eslint-disable @typescript-eslint/no-explicit-any */
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

		console.log('image', image);

		return json({ success: true }, { status: 201 });
	} catch (error) {
		return json(
			{ success: false, error: (error as any).message },
			{ status: 500 }
		);
	}
}
