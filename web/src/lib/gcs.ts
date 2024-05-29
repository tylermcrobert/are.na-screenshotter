import {
	GCS_BUCKET_NAME,
	GCS_CLIENT_EMAIL,
	GCS_PRIVATE_KEY,
	GCS_PROJECT_ID
} from '$env/static/private';
import { Storage } from '@google-cloud/storage';

const storage = new Storage({
	projectId: GCS_PROJECT_ID,
	credentials: {
		private_key: GCS_PRIVATE_KEY,
		client_email: GCS_CLIENT_EMAIL
	}
});

export const snippetsBucket = storage.bucket(GCS_BUCKET_NAME);
