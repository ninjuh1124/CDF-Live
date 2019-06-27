import React from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Feed from './Feed';
import Heading from './Heading';

class FeedContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [],
			thread: {},
			emptyCalls: 0,
			isLoading: false,
			loadingMe: false,
			loggedInAs: sessionStorage.getItem('name'),
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
		axios.get(
			this.props.api + 
			'v1/token.json?refresh_token=' + 
			localStorage.getItem('refreshToken'),
			{ crossdomain: true }
		).then(res => {
			if (res.data.message.access_token) {
				sessionStorage.setItem(
					'accessToken',
					res.data.message.access_token
				);

				// get identity
				if (sessionStorage.getItem('name') === null) {
					this.setState({ loadingMe: true }, () => {
						axios({
							method: 'get',
							url: 'https://oauth.reddit.com/api/v1/me',
							headers: {
								Authorization: 'bearer ' + 
									res.data.message.access_token
								}
						}).then(res => {
							this.setState({
								loadingMe: false,
								loggedInAs: res.data.name
							});
							if (res.data.name) {
								sessionStorage.setItem(
									'name', 
									res.data.name
								);
							}
						}).catch(err => console.log);
					});
				}

				setTimeout(
					() => this.refreshToken(),
					3300000
				);
			}
		});
	}

	componentDidMount() {
		// get thread id
		axios.get(
			this.props.api + 'v1/thread.json',
			{ crossdomain: true }
		).then(res => {
			this.setState({ thread: res.data.message[0] }, () => {
				sessionStorage.setItem('thread', res.data.message[0]._id);
			});
		});

		// load initial comments
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
		
		// refresh access token if possible
		if (localStorage.getItem('refreshToken')) {
			this.refreshToken();
		}
	}

	render() {
		return (
			<div style={{padding: '3px'}}>
				<Heading 
					thread={this.state.thread}
					loggedInAs={this.state.loggedInAs}
				/>

				{
					(!this.state.isLoading 
						? <Feed 
							loggedIn={this.state.loggedInAs != null}
							history={this.state.history}
						/>
						: <p>Loading...</p>
					)
				}
			</div>
		);
	}
}

export default FeedContainer; 
