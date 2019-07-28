import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Heading extends React.Component {
	constructor(props) {
		super(props);
		this.keepGettingAccessToken = this.keepGettingAccessToken.bind(this)
		this.getNewAccessToken = this.getNewAccessToken.bind(this);
	}
	
	getNewAccessToken() {
		axios.get(
			process.env.REACT_APP_API+'v1/token.json?refresh_token'+
			this.props.refreshToken,
			{ crossdomain: true }
		).then(res => {
			if (res.data.message.access_token) {
				let accessToken = res.data.message.accessToken;
				this.props.setAccessToken(accessToken);

				if (!this.props.loggedInAs) {
					axios({
						method: 'get',
						url: 'https://oauth.reddit.com/api/v1/me',
						header: {
							Authorization: 'bearer ' + accessToken
						}
					}).then(res => {
						this.props.setUser(res.data.name);
					});
				}
			}
		});
	}

	keepGettingAccessToken() {
		setTimeout( () => {
			this.getNewAccessToken();
			this.keepGettingAccessToken();
		}, 3300000)
	}

	componentDidMount() {
		if (this.props.refreshToken) {
			this.getNewAccessToken();
			this.keepGettingAccessToken();
		}
	}

	render() {
		let uriBase = "https://reddit.com/api/v1/authorize?",
			redirect = encodeURIComponent(process.env.REACT_APP_REDIRECT),
			scope = ["edit", "read", "save", "submit", "vote", "identity"],
			params = [
				"client_id=" + process.env.REACT_APP_CLIENT_ID,
				"response_type=code",
				"state=" + localStorage.getItem('device'),
				"redirect_uri=" + redirect,
				"duration=permanent",
				"scope=" + scope.join('+')
			].join('&');

		return (
			<div className="heading">
				<h6 className="text-right"><small>
					<Link to="/about" className="corner-link link-primary">
						About
					</Link>
				</small></h6>
	
				<h2
					className="text-center"
					id="title">Casual Discussion Friday</h2>
				<h5 className="text-center"><a
					id="latest"
					className="link-primary"
					href={
						this.props.thread.permalink ? 
						this.props.thread.permalink :
						"https://reddit.com/r/anime"
					}
					rel="noreferrer noopener"
					target="_blank"
				>Latest Thread</a></h5>
	
				<h6 id='logged-in-as' className='text-right'><small>
					{this.props.refreshToken &&
					(this.props.loggedInAs
						? "Logged in as " + this.props.loggedInAs
						: "Loading user info...")
					}
				</small></h6>
	
				<hr id='topbar' />
	
				{this.props.isLoggedIn
				? null
				: <a
					id="reddit-login-button"
					href={uriBase+params}
				><i className="fab fa-reddit" /> Login</a>}
			</div>
		);
	}
}

export default Heading;
