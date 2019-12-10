import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import { getMe } from '../resources/redditAPI';
import { getRefreshToken } from '../resources/appAPI';

import { setUser,
	setAccessToken,
	setRefreshToken } from '../redux/actions';

import { connect } from 'react-redux';

const Login = props => {
	const [gotToken, receiveToken] = useState(false);
	const [error, setError] = useState(null);

	useEffect( () => {
		if (props.state && props.code) {
			getRefreshToken(props.code)
				.then(res => {
					if (res.message.refresh_token) {
						let rt = res.message.refresh_token;
						let at = res.message.access_token;

						props.setRefreshToken(rt);
						props.setAccessToken(at);

						localStorage.setItem('refreshToken', rt);

						getMe(at).then(res => {
							props.setUser(res.data.name);
							receiveToken(true);
						});
					}
				})
				.catch(err => {
					setError(err);
					console.log(err);
				});
		}
	}, []);

	if (gotToken) {
		return <Redirect to='/feed' />
	} else {
		return (
			<p>Authorizing</p>
		);
	}
}

const mapDispatchToProps = dispatch => ({
	setRefreshToken: token => dispatch(setRefreshToken(token)),
	setAccessToken: token => dispatch(setAccessToken(token)),
	setUser: user => dispatch(setUser(user))
});

export default connect(null, mapDispatchToProps)(Login);
