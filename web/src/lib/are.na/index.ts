/* eslint-disable @typescript-eslint/no-explicit-any */
import { ARENA_PERSONAL_ACCESS_TOKEN } from '$env/static/private';

export async function postItem(channelId: string, source: string) {
	if (!channelId) {
		throw new Error('No Are.na channel ID provided.');
	}

	if (!source) {
		throw new Error('No Are.na source provided.');
	}

	const TEST_POST = `https://api.are.na/v2/channels/${channelId}/blocks`;

	try {
		if (!ARENA_PERSONAL_ACCESS_TOKEN) {
			throw new Error('No Are.na personal access token provided.');
		}

		const response = await fetch(TEST_POST, {
			method: 'POST',
			body: JSON.stringify({
				source: source
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${ARENA_PERSONAL_ACCESS_TOKEN}`
			}
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				`Failed to post item to are.na: (${data.code}) ${data.message}: ${data.description}`
			);
		}

		return data;
	} catch (e) {
		const message = (e as any).message || 'Unknown error';
		throw new Error(`Failed to post item to are.na: ${message}`);
	}
}
