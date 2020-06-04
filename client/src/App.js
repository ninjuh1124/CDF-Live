import React, { useState } from 'react';
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch
} from 'react-router-dom';

import {
	CommentFaces,
	ErrorBoundary,
	FeedRoute,
	Login,
	MarkdownPage,
	PageNotFound } from './components';

import { RedditProvider } from './context';
import useReddit from './hooks/useReddit';

import './styles/style.scss';

const App = props => {
	/** CONTEXT VALUES **/
	/** https://reactjs.org/docs/context.html#caveats **/
	const [reddit, setRedditHook] = useState(useReddit());

	return (
		<div id='content'><RedditProvider defaultValue={reddit}>
			<Router><Switch><ErrorBoundary>
				<Route exact path='/' render={()=> (<Redirect to='/feed' />)}
				/>
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
				{/*
				<Route exact
					path='/pagenotfound' component={PageNotFound} />
				<Route render={() => (<Redirect to='/pagenotfound' />)} />
				*/}
			</ErrorBoundary></Switch></Router>
		</RedditProvider></div>
	)
}

export default App;
