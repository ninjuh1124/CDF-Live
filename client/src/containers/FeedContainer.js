import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Feed from '../components/Feed';

import { appendToFeed,
	prependToFeed } from '../redux/actions';

import { connect } from 'react-redux';

export const FeedContext = React.createContext({});

const FeedContainer = props => {
	const [emptyCalls, setEmptyCalls] = useState(0);
	const [isLoading, loading] = useState(true);
	const [newestComment, setNewestComment] = useState({});
	const [error, setError] = useState(null);

	const loadMore = () => {
		axios.get(
			`${process.env.REACT_APP_API}v1/history.json?olderthan=${props.history[props.history.length-1]._id}`,
			{ crossdomain: true }
		).then(res => {
			if (res.data.message &&
				Array.isArray(res.data.message) &&
				res.data.message.length > 0) {
				props.appendToFeed(res.data.message);
				setEmptyCalls(1);
			}
		});
	}

	const getHistory = () => {
		axios
			.get(
				`${process.env.REACT_APP_API}v1/history.json?newerthan=${newestComment._id}`,
				{ crossdomain: true }
			)
			.then(res => {
				// verify message
				if (res.data.message &&
					Array.isArray(res.data.message) &&
					res.data.message.length > 0) {
					props.prependToFeed(res.data.message);
					setNewestComment(res.data.message[0]);
					setEmptyCalls(1);
				} else { // delay api calls between empty responses
					setEmptyCalls(emptyCalls+1);
				}
			})
			.catch(err => {
				setError(err);
			});
	}

	const keepGettingHistory = () => {
		setTimeout( () => {
			getHistory();
			keepGettingHistory();
		},
		(emptyCalls < 24
		? emptyCalls * 5000
		: 24*5000))
	}

	useEffect( () => {
		loading(true);
		setTimeout( () => {
			axios
				.get(
					`${process.env.REACT_APP_API}v1/history.json${newestComment._id ? `?newerthan=${newestComment._id}` : ''}`,
					{ crossdomain: true }
				)
				.then(res => {
					loading(false);
					props.prependToFeed(res.data.message);
					setNewestComment(res.data.message[0]);
					setEmptyCalls(emptyCalls+1);
				})
				.catch(err => {
					setError(err);
				});

		}, emptyCalls < 24 ? emptyCalls * 5000 : 24*5000);
	}, []);

	return (
		<FeedContext.Provider value={{
			comments: props.history,
			hidden: props.hidden,
			isLoading: isLoading,
			error: error
		}}>
			<Feed 
				loadMore={loadMore}
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
