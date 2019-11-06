import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { setUser,
	setAccessToken,
	setRefreshToken } from '../redux/actions';

import { connect } from 'react-redux';

const Login = props => {
	const [gotToken, receiveToken] = useState(false);

	useEffect( () => {
		if (props.state && props.code) {
			axios.get(
				`${process.env.REACT_APP_API}v1/token.json?code=${props.code}`,
					{ crossdomain: true }
			).then(res => {
				if (res.data.message.refresh_token) {
					let rt = res.data.message.refresh_token;
					let at = res.data.message.access_token;
					props.setRefreshToken(rt);
					props.setAccessToken(at);
					localStorage.setItem('refreshToken', rt);
					axios({
						method: 'get',
						url: 'https://oauth.reddit.com/api/v1/me',
						headers: {
							Authorization: `bearer ${at}`
						}
					}).then(res => {
						props.setUser(res.data.name);
						receiveToken(true);
					})
				}
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
