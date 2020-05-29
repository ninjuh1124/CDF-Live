import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import qs from 'querystring';

import { getMe } from '../utils/redditAPI';
import { getRefreshToken } from '../utils/appAPI';

import { RedditContext } from '../context';


const Login = props => {
	const [gotToken, receiveToken] = useState(false);
	const reddit = useContext(RedditContext);

	const params = qs.parse(
		window.location.search, 
		{ ignoreQueryPrefix: true }
	);

	if (params.state && params.code) {
		getRefreshToken(params.code)
			.then(tokens => {
				let rt = tokens.refresh_token;
				let at = tokens.access_token;

				reddit.setRefreshToken(rt);
				reddit.setAccessToken(at);

				receiveToken(true);
			})
			.catch(err => {
				reddit.setError(err);
			});
	} else {
		reddit.setError(new Error('Could not retrieve reddit token'));
		return <Redirect to='/feed' />
	}

	if (gotToken) {
		return <Redirect to='/feed' />
	} else {
		return (
			<p>Authorizing</p>
		);
	}

	return (
		gotToken ? <Redirect to='/feed' /> : <p>Authorizing</p>
	);
};

export default Login;
