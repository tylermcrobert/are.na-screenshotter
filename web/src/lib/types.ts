import type Arena from 'are.na';

export type APIChannel = Pick<
	Arena.Channel,
	'title' | 'id' | 'status' | 'slug' | 'created_at' | 'updated_at' | 'length'
>;

export type APIChannelsResult = {
	success: boolean;
	data: {
		length: number;
		term: string;
		channels: APIChannel[];
	};
};
