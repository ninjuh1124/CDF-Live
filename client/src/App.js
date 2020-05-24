import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';

import {
	About,
	Changelog,
	CommentFaces,
	Feed,
	Heading,
	Login,
	PageNotFound } from './components';

import {
	FeedProvider, RedditProvider,
	useFeed, useReddit } from './context';

import './style.scss';

const App = props => {
	/** CONTEXT **/
	const feed = useFeed();
	const reddit = useReddit();

	/** ROUTE COMPONENTS **/
	const FeedRoute = () => (
		<RedditProvider value={reddit}>
			<div style={{ padding: '3px' }}>
				<Heading />
				<FeedProvider value={feed}>
					<Feed />
				</FeedProvider>
			</div>
		</RedditProvider>
	);

	return (
		<Router><div id='content'><Switch>
			<Redirect exact from='/' to='/feed' />
			<Route exact path='/feed' component={FeedRoute} />
			<Route exact path='/about' component={About} />
			<Route exact path='/changelog' component={Changelog} />
			<Route exact path='/reddit_oauth_login' component={Login} />
			<Route exact path='/faces' component={CommentFaces} />
			<Route component={PageNotFound} />
		</Switch></div></Router>
	)
}

// let params = qs.parse(window.location.search, {ignoreQueryPrefix: true});

export default App;
