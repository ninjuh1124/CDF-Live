import React from 'react';
import axios from 'axios';
import Feed from '../components/Feed';

import { appendToFeed,
	prependToFeed } from '../redux/actions';

import { connect } from 'react-redux';

// still verbose, but at least application state isn't dependent on this one file
class FeedContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			emptyCalls: 1,
			isLoading: false,
			newestComment: null
		};
		this.getHistory = this.getHistory.bind(this);
		this.keepGettingHistory = this.keepGettingHistory.bind(this);
		this.loadMore = this.loadMore.bind(this);
	}

	getHistory() {
		axios.get(
			process.env.REACT_APP_API+'v1/history.json?newerthan=' +
			this.state.newestComment._id,
			{ crossdomain: true }
		).then(res => {
			// verify message
			if (res.data.message &&
				Array.isArray(res.data.message) &&
				res.data.message.length > 0) {
				this.props.prependToFeed(res.data.message);
				this.setState(state => ({
					newestComment: res.data.message[0],
					emptyCalls: 1
				}));
			} else { // delay api calls between empty responses
				this.setState(state => ({
					...state, 
					emptyCalls: state.emptyCalls+1,
				}));
			}
		});
	}

	keepGettingHistory() {
		setTimeout( () => {
			this.getHistory();
			this.keepGettingHistory();
		},
		(this.state.emptyCalls < 24
		? this.state.emptyCalls * 5000
		: 24*5000))
	}

	loadMore() {
		axios.get(
			process.env.REACT_APP_API+'v1/history.json?olderthan=' +
			this.props.history[this.props.history.length-1]._id,
			{ crossdomain: true }
		).then(res => {
			if (res.data.message &&
				Array.isArray(res.data.message) &&
				res.data.message.length > 0) {
				this.props.appendToFeed(res.data.message);
				this.setState({ emptyCalls: 1 });
			}
		});
	}

	componentDidMount() {
		this.setState({ isLoading: true }, () => {
			axios.get(
				process.env.REACT_APP_API+'v1/history.json',
				{ crossdomain: true }
			).then(res => {
				this.setState(
					{
						isLoading: false,
						newestComment: res.data.message[0]
					},
					() => {
						this.props.prependToFeed(res.data.message);
						this.keepGettingHistory();
					}
				);
			}).catch( () => {
				this.setState({ isLoading: false });
			});
		});
	}

	render() {
		return (
			<div style={{padding: '3px'}}>
				<Feed 
					isLoading={this.state.isLoading}
					loadMore={this.loadMore}
					comments={this.props.history && this.props.history
						.filter(comment => !this.props.hidden.includes(comment._id))
						.filter(comment => /^t3_\S+/.test(comment.parentID))
					}
					upvote={this.props.upvote}
				/>
			</div>
		);
	}
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
