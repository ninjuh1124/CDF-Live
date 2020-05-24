import { useState } from 'React';

import { getAccessToken } from '../utils/appAPI'
import { getMe } from '../utils/redditAPI';
import generateString from '../utils/generateString';

const useReddit = () => {
	/** TOKEN STATE **/
	const [refreshToken, setRefreshToken] = useState(
		JSON.parse(localStorage.getItem('refreshToken') || null)
	);
	const [accessToken, setAccessToken] = useState(
		JSON.parse(sessionStorage.getItem('accessToken') || null)
	);
	const [device, setDevice] = useState(
		localStorage.getItem('device') || generateString()
	);
	const [user, setUser] = useState(null);

	/** BROWSER STORAGE **/
	useEffect(() => {
		localStorage.setItem('refreshToken', refreshToken);
	}, [refreshToken]);

	useEffect(() => {
		sessionStorage.setItem('accessToken', accessToken)
	}, [accessToken]);

	/** OTHER EFFECTS **/
	useEffect(() => {
		if (accessToken) {
			// set user to context
			if (!user) {
				getMe(accessToken)
					.then(user => {
						setUser(user);
					})
					.catch(error => {
						setError(error);
					});
			}

			// keep refreshing token
			setTimeout(() => {
				getRefreshToken(refreshToken)
					.then(accessToken => {
						setAccessToken(accessToken);
						setError(null);
					})
					.catch(error => {
						setError(error);
						setAccessToken(null);
					});
			}, 3300000);
		}
	}, [accessToken]);

	/** ERROR HANDLING **/
	const [error, setError] = useState(null);

	return {
		refreshToken, setRefreshToken,
		accessToken, setAccessToken,
		user,
		error, setError
	};
}

export default useReddit;
