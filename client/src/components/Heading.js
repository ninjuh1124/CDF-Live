import React from 'react';
import Editor from './Editor';
import { Link } from 'react-router-dom';
import axios from 'axios';

class Heading extends React.Component {
	constructor(props) {
		super(props);
		this.state = { editorMode: 'hidden' }
		this.toggleEditor = this.toggleEditor.bind(this);
		this.updateThread = this.updateThread.bind(this);
		this.keepGettingAccessToken = this.keepGettingAccessToken.bind(this)
		this.getNewAccessToken = this.getNewAccessToken.bind(this);
	}

	toggleEditor(mode) {
		this.setState(state => ({ editorMode: (mode === state.editorMode
												? 'hidden' : mode) }))
	}

	updateThread() {
		axios.get(process.env.REACT_APP_API+'v1/thread.json',
			{ crossdomain: true }
		).then(res => {
			this.props.updateThread(res.data.message[0]);
		});
	}
	
	getNewAccessToken() {
		axios.get(
			process.env.REACT_APP_API+'v1/token.json?refresh_token='+
			this.props.refreshToken,
			{ crossdomain: true }
		).then(res => {
			if (res.data.message.access_token) {
				let accessToken = res.data.message.access_token;
				this.props.setAccessToken(accessToken);

				if (!this.props.loggedInAs) {
					axios({
						method: 'get',
						url: 'https://oauth.reddit.com/api/v1/me',
						headers: {
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
		this.updateThread();
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
	
				<h6 id='logged-in-as' className='text-right'>
					{this.props.refreshToken &&
					(this.props.loggedInAs
						? <small>
							Logged in as {this.props.loggedInAs} (<a 
								href='javascript:void(0)'
								onClick={this.props.logout}>logout</a>)
						</small>
						: <small>Loading user info...</small>)
					}
				</h6>

				<hr id='topbar' />
	
				{this.props.isLoggedIn ?
					(<a
						href='javascript:void(0)'
						className='reddit-button'
						onClick={() => this.toggleEditor('reply')}
					>reply to thread</a>) :
					(<a
						id="reddit-login-button"
						href={uriBase+params}
					><i className="fab fa-reddit" /> Login</a>)
				}

				{this.state.editorMode === 'hidden' ||
					<Editor
						editorMode={this.state.editorMode}
						toggleEditor={this.toggleEditor}
						_id={this.props.thread._id}
						accessToken={this.props.accessToken}
						upvote={this.props.upvote}
					/>	
				}
			</div>
		);
	}
}

export default Heading;
