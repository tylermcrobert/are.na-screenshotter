import { json } from '@sveltejs/kit';

export async function POST({ request }) {
	const data = await request.json();
	return json({ success: true, data }, { status: 201 });
}
