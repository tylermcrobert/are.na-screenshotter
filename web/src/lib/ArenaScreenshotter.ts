const ARENA_API_BASE_URL = 'https://api.are.na/v2';

export class ArenaScreenshotter {
	private token: string;

	constructor(token: string) {
		this.token = token;
	}

	/**
	 * Fetches data from the Arena API.
	 * @param method - The HTTP method to use.
	 * @param url - The URL to fetch data from.
	 * @param body - The body of the request.
	 * @returns A Promise that resolves to the fetched data.
	 */
	private async fetchApi(method: 'GET' | 'POST', url: string, body?: object) {
		const response = await fetch(url, {
			method,
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.token}`
			}
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(
				`API request failed: (${data.code}) ${data.message}: ${data.description}`
			);
		}

		return data;
	}

	/**
	 * Posts an item to are.na channel
	 * @param channelId ID to post channel to
	 * @param payload data to post
	 * @returns API response
	 */
	async postItem(
		channelId: string,
		payload: {
			source: string;
			originTitle: string;
			originUrl: string;
		}
	) {
		const url = `${ARENA_API_BASE_URL}/channels/${channelId}/blocks`;

		return this.fetchApi('POST', url, {
			source: payload.source,
			title: payload.originTitle,
			description: payload.originUrl
		});
	}
}
