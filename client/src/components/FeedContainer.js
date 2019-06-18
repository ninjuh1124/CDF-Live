import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Feed from './Feed';
import Heading from './Heading';

class FeedContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refreshToken: localStorage.getItem('refreshToken'),
			accessToken: null,
			device: localStorage.getItem('device')
		};
		this.refreshToken = this.refreshToken.bind(this);
	}

	refreshToken() {
		axios.get(
			this.props.api + 
			'v1/token.json?refresh_token=' + 
			this.state.refreshToken,

			{ crossdomain: true }
		).then(res => {
			if (res.data.message.access_token) {
				sessionStorage.setItem(
					'accessToken',
					res.data.message.accessToken
				);
				// refresh access token every 55 minutes
				setTimeout(
					() => this.refreshToken(),
					3300000
				);
			}
		});
	}

	componentDidMount() {
		// refresh access token if possible
		if (this.state.refreshToken) {
			this.refreshToken();
		}
	}

	render() {
		let uriBase = "https://www.reddit.com/api/v1/authorize?";
		let redirect = encodeURIComponent("http://localhost:3000/reddit_oauth_login");
		let scope = ["edit", "read", "save", "submit", "vote"]
		let params = [
			"client_id=WfSifmea8-anYA",
			"response_type=code",
			"state=" + localStorage.getItem('device'),
			"redirect_uri=" + redirect,
			"duration=permanent",
			"scope=" + scope.join('+')
		].join('&');

		return (
			<div style={{padding: '3px'}}>
				<h6
					className="text-right"
				><small>
					<Link to="/about" className="corner-link link-primary">About</Link>
				</small></h6>
				<Heading api={this.props.api} />
				{this.props.loggedIn != null
				? null
				: <a
					id="reddit-login-button"
					href={uriBase+params}
				><i className="fab fa-reddit" />Login</a>}
				<Feed api={this.props.api} />
			</div>
		);
	}
}

export default FeedContainer; 
