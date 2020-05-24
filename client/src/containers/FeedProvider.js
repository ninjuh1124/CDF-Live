import React from 'react';
import Feed from '../components/Feed';

import useFeed from '../hooks/useFeed';

const FeedContainer = props => {
	const feed = useFeed();
	return (
		<FeedContext.Provider value={feed}>
			<Feed />
		</FeedContext.Provider>
	);
}

export default FeedContainer;
