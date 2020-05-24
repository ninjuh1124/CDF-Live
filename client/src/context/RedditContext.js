import { createContext } from 'react';

const RedditContext = createContext({
	refreshToken: null,
	setRefreshToken: null,
	accessToken: null,
	setAccessToken: null
});

export default RedditContext;
