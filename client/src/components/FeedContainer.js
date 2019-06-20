import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Feed from './Feed';
import Heading from './Heading';
import _ from 'lodash';

class FeedContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			refreshToken: localStorage.getItem('refreshToken'),
			history: [],
			emptyCalls: 0,
			isLoading: true,
			loggedIn: false,
			device: localStorage.getItem('device')
		};
		this.refreshToken = this.refreshToken.bind(this);
		this.getHistory = this.getHistory.bind(this);
	}

	getHistory() {
		axios.get(
			this.props.api+'v1/history.json?newerthan=' +
			this.state.history[0]._id,
			{ crossdomain: true }
		).then(res => {
			if (res.data.message &&
				Array.isArray(res.data.message) &&
				res.data.message.length > 0) {
				this.setState(state => {
					return {
						history: [
							...res.data.message.filter(comment => {
								return !(state.history
									.map(comment => comment._id)
									.includes(comment._id)
								);
							}),
							...state.history
						],
						emptyCalls: 1
					}
				});
			} else {
				this.setState(state => {
					return { emptyCalls: state.emptyCalls + 1 }
				});
			}

			setTimeout( () => this.getHistory(),
				(this.state.empyCalls < 24
				? this.state.empytCalls * 5000
				: 24 * 5000
				)
			);
		});
	}

	refreshToken() {
		// history
		this.setState({ isLoading: true }, () => {
			axios.get(
				this.props.api +
				'v1/commenttree.json',
				{ crossdomain: true }
			).then(res => {
				if (res.data.err) console.log(res.data.err);
				this.setState({
					history: res.data.message,
					isLoading: false
				});
				setTimeout( () => this.getHistory(), 5000);
			}).catch(err => {
				this.setState({ isLoading: false });
				console.log(err);
			});
		});

		// access token
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
				{this.state.refreshToken != null
				? null
				: <a
					id="reddit-login-button"
					href={uriBase+params}
				><i className="fab fa-reddit" />Login</a>}
				{
					(!this.state.isLoading 
						? <Feed 
							history={this.state.history}
							loggedIn={this.state.loggedIn}
						/>
						: <p>Loading...</p>
					)
				}
			</div>
		);
	}
}

export default FeedContainer; 
