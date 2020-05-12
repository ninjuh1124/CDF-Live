import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';

import FeedContainer from './containers/FeedContainer';
import HeadingContainer from './containers/HeadingContainer';

import About from './components/About';
import Changelog from './components/Changelog';
import Login from './components/Login';
import CommentFaces from './components/CommentFaces';
import PageNotFound from './components/PageNotFound';

import qs from 'querystring';

import './style.scss';

class App extends React.Component {
	constructor() {
		super();
		this.generateString = this.generateString.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
	}

	handleLogin(refreshToken, accessToken) {
		localStorage.setItem('refreshToken', refreshToken);
		sessionStorage.setItem('accesToken', accessToken);
	}

	generateString() {
		let str = "";
		let chars = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
		for (let i=1; i<20; i++) {
			str += chars[Math.floor(Math.random() * chars.length)];
		}
		return str;
	}

	componentDidMount() {
		// set unique string for device, for use in Reddit OAuth
		if (localStorage.getItem('device') == null) {
			localStorage.setItem('device', this.generateString());
		}
	}

	render() {
		let api = process.env.REACT_APP_API;
		let params = qs.parse(window.location.search, {ignoreQueryPrefix: true});
		return (
			<Router><div id="content">
				<Switch>
					<Redirect exact from='/' to='/feed' />
					<Route
						exact path='/feed'
						render={ () => {
							return <div stype={{padding: '3px'}}>
								<HeadingContainer />
								<FeedContainer />
							</div>
						}}
					/>
					<Route
						exact path='/about'
						render={ () => {
							return <About api={api} />
						}}
					/>
					<Route
						exact path='/changelog'
						render={ () => (<Changelog />) }
					/>
					<Route
						exact path='/reddit_oauth_login'
						render={ () => ( <Login 
								handleLogin={this.handleLogin} 
								state={params.state}
								code={params.code}
							/>
						)}
					/>
					<Route
						exact path='/faces'
						component={CommentFaces}
					/>
					<Route component={PageNotFound} />
				</Switch>
			</div></Router>
		);
	}
}

export default App;
