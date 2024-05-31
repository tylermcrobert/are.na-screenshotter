const ARENA_API_BASE_URL = 'https://api.are.na/v2';
import type Arena from 'are.na';
import type { APIChannel, APIChannelsResult } from '../types';

class ArenaError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'ArenaError';
	}
}

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
		try {
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
		} catch (e) {
			if (e instanceof ArenaError) {
				throw e;
			} else {
				throw new ArenaError('Unknown error');
			}
		}
	}

	/**
	 * Transforms an Arena channel object into an API channel object.
	 * @param channel original channel object
	 * @returns transformed channel object
	 */
	private transformChannel(channel: Arena.Channel): APIChannel {
		return {
			title: channel.title,
			id: channel.id,
			status: channel.status,
			slug: channel.slug,
			created_at: channel.created_at,
			updated_at: channel.updated_at,
			length: channel.length
		};
	}

	/**
	 * Searches for channels based on the provided query string and user slug.
	 * @param q - The query string to search for.
	 * @param options - Additional options for the search, including the user slug.
	 * @returns A Promise that resolves to an object containing the search results.
	 */
	async searchChannels(
		q: string,
		options: { userSlug: string }
	): Promise<APIChannelsResult> {
		const url = `${ARENA_API_BASE_URL}/search/channels?q=${q}&per=5`;
		const response = await this.fetchApi('GET', url);

		const channelResponse: Arena.Channel[] = response.channels;
		const filteredChannels = channelResponse.filter((channel) => {
			return channel.user.slug === options.userSlug;
		});
		const channels = filteredChannels.map((channel) =>
			this.transformChannel(channel)
		);

		return {
			length: response.length,
			channels: channels
		};
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
			pageTitle: string;
			pageUrl: string;
		}
	) {
		const url = `${ARENA_API_BASE_URL}/channels/${channelId}/blocks`;

		return this.fetchApi('POST', url, {
			source: payload.source,
			title: payload.pageTitle,
			description: payload.pageUrl
		});
	}

	/**
	 * Retrieves the channels of a user from the Arena API.
	 * @param userId - The ID of the user.
	 * @returns Transformed channels
	 */
	async getUserChannels(userId: string): Promise<APIChannelsResult> {
		const url = `${ARENA_API_BASE_URL}/users/${userId}/channels?per=5`;
		const response = await this.fetchApi('GET', url);

		const channelsResponse: Arena.Channel[] = response.channels;
		const channels = channelsResponse.map((channel) =>
			this.transformChannel(channel)
		);

		return {
			length: response.length,
			channels: channels
		};
	}
}
