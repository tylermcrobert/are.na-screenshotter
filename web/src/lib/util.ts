import { v4 } from 'uuid';

export function generateFilename(extension: string) {
	return `${v4()}.${extension}`;
}

export function getDataFromBase64(base64String: string) {
	const base64Regex = /^data:([A-Za-z-+/]+);base64,/;
	const mimeType = base64String.match(base64Regex)?.[1];

	if (!mimeType) {
		throw new Error('Invalid base64 string');
	}

	const base64Data = base64String.replace(base64Regex, '');
	const buffer = Buffer.from(base64Data, 'base64');
	const extension = mimeType.split('/')[1];
	const filename = generateFilename(extension);

	return { buffer, filename };
}
