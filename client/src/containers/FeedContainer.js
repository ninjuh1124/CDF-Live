import React from 'react';
import Feed from '../components/Feed';

import useFeed from '../hooks/useFeed';

export const FeedContext = React.createContext({
	history: [],
	hidden: [],
	isLoading: false,
	error: null,
	prepend: null,
	loadMore: null
});

const FeedContainer = props => {
	const feed = useFeed();
	return (
		<FeedContext.Provider value={feed}>
			<Feed />
		</FeedContext.Provider>
	);
}

export default FeedContainer;
