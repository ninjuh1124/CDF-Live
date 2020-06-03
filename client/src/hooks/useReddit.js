import { useState, useEffect, useRef } from 'react';

import { getRefreshToken, getAccessToken } from '../utils/appAPI'
import { getMe } from '../utils/redditAPI';
import generateString from '../utils/generateString';

const useReddit = () => {
	/** TOKEN STATE **/
	const [refreshToken, setRefreshToken] = useState(
		JSON.parse(localStorage.getItem('refreshToken') || null)
	);
	const accessToken = useRef(
		JSON.parse(sessionStorage.getItem('accessToken') || null)
	);
	const [device, setDevice] = useState(
		localStorage.getItem('device') || generateString()
	);
	const [user, setUser] = useState(null);

	const logout = () => {
		setRefreshToken(null);
		accessToken.current = null;
		setUser(null);
	};

	/** TOKEN EFFECTS **/
	useEffect(() => {
		if (refreshToken) getAccessToken(refreshToken)
			.then(at => {
				accessToken.current = at;
			})
			.catch(err =>{	// on error, force logout
				setError(err);
				logout();
			});

		return (() => { 
			localStorage.setItem('refreshToken', refreshToken); 
		});
	}, [refreshToken]);

	useEffect(() => {
		if (accessToken.current) {
			// set user to context
			if (!user) {
				getMe(accessToken.current)
					.then(user => {
						setUser(user);
					})
					.catch(error => {
						setError(error);
						logout();
					});
			}

			// keep refreshing token
			setTimeout(() => {
				getRefreshToken(refreshToken)
					.then(at => {
						accessToken.current = at;
						setError(null);
					})
					.catch(error => {
						setError(error);
						logout();
					});
			}, 3300000);
		}

		return (() => {
			sessionStorage.setItem('accessToken', accessToken.current);
		});
	}, [accessToken.current]);

	/** ERROR HANDLING **/
	const [error, setError] = useState(null);

	return {
		refreshToken, setRefreshToken,
		accessToken: accessToken.current,
		user, logout,
		error, setError
	};
}

export default useReddit;
