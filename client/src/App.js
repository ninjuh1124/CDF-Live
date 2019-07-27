import React from 'react';
import FeedContainer from './containers/FeedContainer';
import About from './components/About';
import Changelog from './components/Changelog';
import PageNotFound from './components/PageNotFound';
import Login from './components/Login';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';
import * as qs from 'query-string';

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
							return <FeedContainer 
								api={api} 
							/>
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
						render={ () => {
							return <Changelog api={api} />
						}}
					/>
					<Route
						exact path='/reddit_oauth_login'
						render={ () => {
							return <Login 
								handleLogin={this.handleLogin} 
								api={api}
								state={params.state}
								code={params.code}
							/>
						}}
					/>
					<Route component={PageNotFound} />
				</Switch>
			</div></Router>
		);
	}
}

export default App;
