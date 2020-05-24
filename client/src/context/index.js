import React from 'react';
import FeedContext from './FeedContext';
import RedditContext from './RedditContext';

export default {
	FeedContext, RedditContext,

	FeedProvider: ({ defaultValue, children }) => (
		<FeedContext.Provider value={defaultValue}>
			{children}
		</FeedContext.Provider>
	),

	RedditProvider: ({ defaultValue, children }) => (
		<RedditContext.Provider value={defaultValue}>
			{children}
		</RedditContext.Provider>
	)
}
