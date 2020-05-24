import { createContext } from 'react';

const FeedContext = createContext({
	history: [],
	hidden: [],
	isLoading: false,
	error: null,
	prepend: null,
	loadMore: null
});

export default FeedContext;
