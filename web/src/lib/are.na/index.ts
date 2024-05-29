import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';

export async function postItem() {
	const TEST_POST = 'https://api.are.na/v2/channels/tests-twjgqznfouc/blocks';

	try {
		const response = await fetch(TEST_POST, {
			method: 'POST',
			body: JSON.stringify({
				source:
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL2nnM2tOVMLht00mgSaYOOKpJGxY_9UA5MQ&s'
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${ARENA_PERSONAL_ACCESS_TOKEN}`
			}
		});

		const data = await response.json();

		return data;
	} catch (e) {
		console.log(e);
		throw new Error('Failed to post item');
	}
}
