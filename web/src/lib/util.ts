/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export function extractAccessToken(request: Request) {
	const authorizationHeader = request.headers.get('Authorization');
	const token = authorizationHeader?.split(' ')[1];

	if (!token || token === '') {
		throw new Error('Could not extract access token from request.');
	}

	return token;
}

export function handleApiError(error: any) {
	let message = error.message || 'An unknown internal error occurred.';
	let code = 500;

	if (error instanceof ZodError) {
		message = error.errors[0].message;
		code = 400;
	}

	return json({ success: false, error: message }, { status: code });
}
