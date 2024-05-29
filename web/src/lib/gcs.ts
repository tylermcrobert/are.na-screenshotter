import {
	GCS_BUCKET_NAME,
	GCS_CLIENT_EMAIL,
	GCS_PRIVATE_KEY,
	GCS_PROJECT_ID
} from '$env/static/private';
import { Storage } from '@google-cloud/storage';

export const storage = new Storage({
	projectId: GCS_PROJECT_ID,
	credentials: {
		private_key: GCS_PRIVATE_KEY,
		client_email: GCS_CLIENT_EMAIL
	}
});

export async function uploadGCSFile(
	buffer: Buffer,
	{ filename }: { filename: string }
) {
	const bucket = storage.bucket(GCS_BUCKET_NAME);
	const gcsFile = bucket.file(filename);
	await gcsFile.save(buffer);

	if (!gcsFile || !gcsFile.id) {
		throw new Error('There was an error uploading file');
	}

	if (!gcsFile.publicUrl()) {
		throw new Error('Could not get public URL for file.');
	}

	return {
		id: gcsFile.id,
		publicUrl: gcsFile.publicUrl()
	};
}
