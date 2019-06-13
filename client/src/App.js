import React from 'react';
import FeedContainer from './components/FeedContainer';
import About from './components/About';
import Changelog from './components/Changelog';
import PageNotFound from './components/PageNotFound';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';
import './style.scss';

const App = () => {
	let api = 'http://localhost:8080/';
	return (
		<Router><div id="content">
			<Switch>
				<Redirect exact from='/' to='/feed' />
				<Route
					exact path='/feed'
					render={ () => {
						return <FeedContainer api={api} />
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
					exact path='/login'
				/>
				<Route component={PageNotFound} />
			</Switch>
		</div></Router>
	);
}

export default App;
