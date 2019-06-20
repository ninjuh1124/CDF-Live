import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null
		};
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo
		});
	}

	render() {
		if (this.state.errorInfo) {
			return (
				<div>
					<h2>Something went wrong.</h2>
					<details style={{ whiteSpace: 'pre-wrap' }}>
						{this.state.error && this.state.error.toString()}
						<br />
						{this.state.errorInfo.componentStack}
					</details>
				</div>
			);
		}

		return this.props.children;
	}
}

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
			axios.get(this.props.api + 'v1/token.json?code=' + this.props.code,
						{ crossdomain: true })
				.then(res => {
					console.log(res);
					if (res.data.message.refresh_token) {
						console.log(res.data.message.refresh_token);
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
				<ErrorBoundary>
					Authorizing
				</ErrorBoundary>
			);
		}
	}
}


export default Login;
