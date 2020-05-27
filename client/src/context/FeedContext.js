import { createContext } from 'react';

const FeedContext = createContext({
	history: [],
	isLoading: false,
	prepend: null,
	loadMore: null,
	upvoted: [],
	hidden: [],
	saved: [],
	upvoteDispatch: null,
	hideDispatch: null,
	saveDispatch: null,
	error: new Error('Feed context parameters not set'),
	setError: null
});

export default FeedContext;
