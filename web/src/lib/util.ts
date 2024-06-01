export function extractAccessToken(request: Request) {
	const authorizationHeader = request.headers.get('Authorization');
	const token = authorizationHeader?.split(' ')[1];

	if (!token || token === '') {
		throw new Error('Could not extract access token from request.');
	}

	return token;
}
