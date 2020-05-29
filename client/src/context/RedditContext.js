import { createContext } from 'react';

const RedditContext = createContext({
	refreshToken: null,
	setRefreshToken: null,
	accessToken: null,
	setAccessToken: null,
	user: null,
	error: new Error('Reddit context parameters not set'),
	setError: null
});

export default RedditContext;
