import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';

const TEST_POST = 'https://api.are.na/v2/channels/tests-twjgqznfouc/blocks';

export const actions = {
	default: async () => {
		try {
			const idk = await fetch(TEST_POST, {
				method: 'POST',
				body: JSON.stringify({
					source: 'https://tylermcrobert.com/info'
				}),
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${ARENA_PERSONAL_ACCESS_TOKEN}`
				}
			});

			const data = await idk.json();
			console.log(data);
		} catch (e) {
			console.log(e);
		}
	}
};
