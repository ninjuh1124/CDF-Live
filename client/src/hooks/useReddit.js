import { useState } from 'React';

const useReddit = () => {
	const [refreshToken, setRefreshToken] = useState(
		JSON.parse(localStorage.getItem('refreshToken') || null)
	);
	const [accessToken, setAccessToken] = useState(
		JSON.parse(sessionStorage.getItem('accessToken') || null)
	);

	return {
		refreshToken, setRefreshToken,
		accessToken, setAccessToken
	};
}
