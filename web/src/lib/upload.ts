import { v4 } from 'uuid';

import {
	GCS_BUCKET_NAME,
	GCS_CLIENT_EMAIL,
	GCS_PRIVATE_KEY,
	GCS_PROJECT_ID
} from '$env/static/private';
import { Storage } from '@google-cloud/storage';

/**
 * Setup the Google Cloud Storage client.
 */
const storage = new Storage({
	projectId: GCS_PROJECT_ID,
	credentials: {
		private_key: GCS_PRIVATE_KEY,
		client_email: GCS_CLIENT_EMAIL
	}
});

/**
 * Regular expression to match the base64 string.
 */
const BASE_64_REGEX = /^data:([A-Za-z-+/]+);base64,/;

/**
 * Generates a unique filename for a given base64 string.
 */
function parseExtension(base64String: string) {
	const mimeType = base64String.match(BASE_64_REGEX)?.[1];

	if (!mimeType) {
		throw new Error('Invalid base64 string');
	}

	const extension = mimeType.split('/')[1];

	return `${v4()}.${extension}`;
}

/**
 * Upload a base64 image to Google Cloud Storage.
 */
export async function uploadBase64Image(base64String: string) {
	const base64Data = base64String.replace(BASE_64_REGEX, '');
	const buffer = Buffer.from(base64Data, 'base64');

	const filename = parseExtension(base64String);

	const snippetsBucket = storage.bucket(GCS_BUCKET_NAME);
	const gcsFile = snippetsBucket.file(filename);
	await gcsFile.save(buffer);

	return gcsFile;
}
