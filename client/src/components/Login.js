import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

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
			axios.get(process.env.NODE_APP_API + 
						'v1/token.json?code=' + 
						this.props.code,
						{ crossdomain: true })
				.then(res => {
					if (res.data.message.refresh_token) {
						this.props.handleLogin(res.data.message.refresh_token, res.data.message.access_token);
						this.setState({ gotToken: true });
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

export default Login;
