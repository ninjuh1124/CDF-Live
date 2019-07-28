import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { setUser,
	setAccessToken,
	setRefreshToken } from '../redux/actions';

import { connect } from 'react-redux';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			gotToken: false,
			error: null
		}
	}

	componentDidMount() {
		if (this.props.state && this.props.code) {
			axios.get(
				process.env.REACT_APP_API + 
					'v1/token.json?code=' + 
					this.props.code,
					{ crossdomain: true }
			).then(res => {
				if (res.data.message.refresh_token) {
					let rt = res.data.message.refresh_token;
					let at = res.data.message.access_token;
					this.props.setRefreshToken(rt);
					this.props.setAccessToken(at);
					localStorage.setItem('refreshToken', rt);
					axios({
						method: 'get',
						url: 'https://oauth.reddit.com/api/v1/me',
						header: {
							Authorization: 'bearer ' + at
						}
					}).then(res => {
						this.props.setUser(res.data.name);
						this.setState({ gotToken: true });
					})
				} else {
					this.setState({ error: 'Error retrieving token' });
				}
			});
		} else {
			this.setState({ error: 'Invalid params' });
		}
	}
	
	render() {
		if (this.state.gotToken) {
			return <Redirect to='/feed' />
		} else {
			return (
				<p>Authorizing</p>
			);
		}
	}
}

const mapDispatchToProps = dispatch => ({
	setRefreshToken: token => dispatch(setRefreshToken(token)),
	setAccessToken: token => dispatch(setAccessToken(token)),
	setUser: user => dispatch(setUser(user))
});

export default connect(null, mapDispatchToProps)(Login);
