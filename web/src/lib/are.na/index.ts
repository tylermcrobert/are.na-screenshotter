const ARENA_API_BASE_URL = 'https://api.are.na/v2';

class ArenaError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'ArenaError';
	}
}

async function fetchApi(
	url: string,
	method: 'GET' | 'POST',
	token: string,
	body?: object
): Promise<object> {
	try {
		const response = await fetch(url, {
			method,
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		});

		const data = await response.json();

		if (!response.ok) {
			throw new ArenaError(
				`API request failed: (${data.code}) ${data.message}: ${data.description}`
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

export async function postItem({
	channelId,
	source,
	token,
	title,
	description
}: {
	channelId: string;
	source: string;
	token: string;
	title: string;
	description: string;
}) {
	const url = `${ARENA_API_BASE_URL}/channels/${channelId}/blocks`;

	return fetchApi(url, 'POST', token, {
		source,
		title,
		description
	});
}

export async function getUserChannels({
	userId,
	token
}: {
	userId: string;
	token: string;
}) {
	const url = `${ARENA_API_BASE_URL}/users/${userId}/channels?per=5`;
	return fetchApi(url, 'GET', token);
}
