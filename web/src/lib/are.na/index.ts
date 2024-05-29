class ArenaError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'ArenaError';
	}
}

/**
 * Posts an item to an Are.na channel.
 * @param channelId - The ID of the Are.na channel.
 * @param source - The source of the item to be posted.
 * @returns A Promise that resolves to the response data from Are.na API.
 * @throws Error if no Are.na channel ID is provided, no source is provided, no personal access token is provided, or if there is a failure in posting the item to Are.na.
 */

export async function postItem({
	channelId,
	token,
	source
}: {
	channelId: string;
	source: string;
	token: string;
}) {
	if (!channelId) {
		throw new ArenaError('No Are.na channel ID provided.');
	}

	if (!source) {
		throw new ArenaError('No Are.na source provided.');
	}

	if (!token) {
		throw new ArenaError('No Are.na personal access token provided.');
	}

	const ARENA_API_URL = `https://api.are.na/v2/channels/${channelId}/blocks`;

	try {
		const response = await fetch(ARENA_API_URL, {
			method: 'POST',
			body: JSON.stringify({ source }),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ArenaError(
				`Failed to post item to are.na: (${data.code}) ${data.message}: ${data.description}`
			);
		}

		return data;
	} catch (e) {
		if (e instanceof ArenaError) {
			throw e;
		} else {
			throw new ArenaError('Unknown error');
		}
	}
}
