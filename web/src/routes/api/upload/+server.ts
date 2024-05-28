import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	console.log('POST /api/upload');

	const data = await request.json();
	return json({ success: true, data }, { status: 201 });
}
