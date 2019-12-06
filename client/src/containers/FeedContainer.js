import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Feed from '../components/Feed';

import { appendToFeed,
	prependToFeed } from '../redux/actions';
import { getHistory, loadMore } from '../resources/appAPI';

import { connect } from 'react-redux';

export const FeedContext = React.createContext({});

const FeedContainer = props => {
	const [emptyCalls, setEmptyCalls] = useState(0);
	const [isLoading, loading] = useState(true);
	const [newestComment, setNewestComment] = useState({});
	const [error, setError] = useState(null);

	const forceRefresh = () => setEmptyCalls(0);

	const load = () => {
		try {
			const res = loadMore(props.history[props.history.length-1]._id);
			if (res.message.length > 0) {
				props.appendToFeed(res.message);
				setEmptyCalls(1);
			}
		} catch(err) {
			setError(err);
			console.log(err);
		}
	};

	useEffect( () => {
		setTimeout( () => {
			try {
				const res = getHistory(newestComment._id);
				console.log(res);
				if (res.length > 0) {
					props.prependToFeed(res.message);
					setNewestComment(res.message[0]);
					setEmptyCalls(1);
				} else {
					setEmptyCalls(emptyCalls+1);
				}
			} catch(err) {
				setError(err);
				console.log(err);
			}
		}, emptyCalls < 24 ? emptyCalls * 5000 : 24*5000);
	}, [emptyCalls]);

	return (
		<FeedContext.Provider value={{
			comments: props.history,
			hidden: props.hidden,
			isLoading: isLoading,
			error: error
		}}>
			<Feed 
				loadMore={load}
			/>
		</FeedContext.Provider>
	);
}

const mapStateToProps = (state, ownProps) => ({
	history: state.feed.history,
	hidden: state.feed.hidden
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	appendToFeed: arr => dispatch(appendToFeed(arr)),
	prependToFeed: arr => dispatch(prependToFeed(arr))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FeedContainer);
