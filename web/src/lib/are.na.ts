const ARENA_API_BASE_URL = 'https://api.are.na/v2';
import type Arena from 'are.na';
import type { APIChannel, APIChannelsResult } from './types';

class ArenaError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = 'ArenaError';
	}
}

function transformChannel(channel: Arena.Channel): APIChannel {
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

async function fetchApi(
	url: string,
	method: 'GET' | 'POST',
	token: string,
	body?: object
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
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

export async function searchChannels({
	q,
	token
}: {
	q: string;
	token: string;
}): Promise<APIChannelsResult> {
	const url = `${ARENA_API_BASE_URL}/search/channels?q=${q}&per=5`;
	const response = await fetchApi(url, 'GET', token);

	const filteredChannels: Arena.Channel[] = response.channels.filter(
		(channel: Arena.Channel) => channel.user.slug === 'tyler-mcrobert'
	);

	const channels = filteredChannels.map((channel) => transformChannel(channel));

	return {
		success: true,
		data: {
			length: filteredChannels.length,
			term: response.term,
			channels: channels
		}
	};
}
