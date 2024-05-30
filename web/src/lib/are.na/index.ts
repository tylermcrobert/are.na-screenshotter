class ArenaError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'ArenaError';
	}
}

async function fetchApi(
	url: string,
	method: string,
	token: string,
	body?: object
) {
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

	return fetchApi(ARENA_API_URL, 'POST', token, {
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
	const ARENA_API_URL = `https://api.are.na/v2/users/${userId}/channels`;
	return fetchApi(ARENA_API_URL, 'GET', token);
}
