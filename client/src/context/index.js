import React from 'react';
import FeedContext from './FeedContext';
import RedditContext from './RedditContext';

const FeedProvider = ({ defaultValue, children }) => (
	<FeedContext.Provider value={defaultValue}>
		{children}
	</FeedContext.Provider>
);

const RedditProvider = ({ defaultValue, children }) => (
	<RedditContext.Provider value={defaultValue}>
		{children}
	</RedditContext.Provider>
);

export {
	FeedContext, RedditContext,
	FeedProvider, RedditProvider
};
