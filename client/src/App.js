import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';

import {
	CommentFaces,
	FeedRoute,
	Login,
	MarkdownPage,
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
		<div style={{ padding: '3px' }}>
			<Heading 
				title='Casual Discussion Friday'
				prebar={() => {
				}}
				postbar={() => {
				}}
			/>
			<FeedProvider defaultValue={feed}>
				<Feed />
			</FeedProvider>
		</div>
	);

	return (
		<Router><div id='content'><Switch>
			<RedditProvider defaultValue={reddit}>
				<Redirect exact 
					from='/' to='/feed' />
				<Route exact 
					path='/feed' component={FeedRoute} />
				<Route exact 
					path='/about' component={() => (
						<MarkdownPage 
							title='About'
							endpoint='content/about.md' 
						/>
					)} />
				<Route exact 
					path='/changelog' component={() => (
						<MarkdownPage 
							title='Changelog'
							endpoint='content/changelog.md' 
						/>
					)} />
				<Route exact 
					path='/reddit_oauth_login' component={Login} />
				<Route exact 
					path='/faces' component={CommentFaces} />
				<Route 
					component={PageNotFound} />
			</RedditProvider>
		</Switch></div></Router>
	)
}

export default App;
