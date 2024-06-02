/* eslint-disable @typescript-eslint/no-explicit-any */

import { json } from '@sveltejs/kit';
import { ZodError } from 'zod';

export function handleApiError(error: any) {
	let message = error.message || 'An unknown internal error occurred.';
	let code = 500;

	if (error instanceof ZodError) {
		message = error.errors[0].message;
		code = 400;
	}

	return json({ error: true, message: message }, { status: code });
}
