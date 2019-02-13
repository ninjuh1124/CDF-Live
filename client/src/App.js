import React from 'react';
import Feed from './components/Feed';
import About from './components/About';
import PageNotFound from './components/PageNotFound';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';
import './style.css';

const App = () => {
	let api = 'http://localhost:8080/v1/';
	return (
		<Router><div id="content">
			<Switch>
				<Redirect exact from='/' to='/feed' />
				<Route
					exact path='/feed'
					render={ () => {
						return <Feed api={api} />
					}}
				/>
				<Route
					exact path='/about'
					render={ () => {
						return <About api={api} />
					}}
				/>
				<Route component={PageNotFound} />
			</Switch>
		</div></Router>
	);
}

export default App;
