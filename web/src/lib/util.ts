import { v4 } from 'uuid';

export function getDataFromBase64(base64String: string) {
	const base64Regex = /^data:([A-Za-z-+/]+);base64,/;

	const fileType = base64String.match(base64Regex)?.[1];

	if (!fileType) {
		throw new Error('Invalid base64 string');
	}

	const base64Data = base64String.replace(base64Regex, '');

	const buffer = Buffer.from(base64Data, 'base64');

	return { buffer, fileType };
}

export function generateFilename(extension: string) {
	return `${v4()}.${extension}`;
}
