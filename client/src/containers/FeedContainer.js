import React from 'react';
import Editor from '../components/Editor';
import Feed from '../components/Feed';

import { appendToFeed,
	prependToFeed,
	setAccessToken,
	setUser } from '../redux/actions';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// still verbose, but at least application state isn't dependent on this one file
class FeedContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			emptyCalls: 1,
			isLoading: false,
			editorMode: 'hidden'
		};
		this.getHistory = this.getHistory.bind(this);
		this.keepGettingHistory = this.keepGettingHistory.bind(this);
		this.toggleEditor = this.toggleEditor.bind(this);
		this.loadMore = this.loadMore.bind(this);
	}

	getHistory() {
		axios.get(
			process.env.REACT_APP_API+'v1/history.json?newerthan=' +
			this.props.history[0]._id,
			{ crossdomain: true }
		).then(res => {
			// verify message
			if (res.data.message &&
				Array.isArray(res.data.message) &&
				res.data.message.length > 0) {
				this.props.prependToFeed(res.data.message);
				this.setState({ emptyCalls: 1 });
			} else { // delay api calls between empty responses
				this.setState(state => { emptyCalls: state.emptyCalls+1 });
			}
		});
	}

	keepGettingHistory() {
		setTimeout( () => {
			this.getHistory();
			this.keepGettingHistory();
		},
		this.state.emptyCalls < 24
		? this.state.emptyCalls * 5000
		: 24*5000
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

	toggleEditor(mode) {
		this.setState(state => { editorMode: mode === state.editorMode
													? 'hidden'
													: mode });
	}

	componentDidMount() {
		axios.get(
			process.env.REACT_APP_API+'v1/history.json',
			{ crossdomain: true }
		).then(res => {
			this.props.prependToFeed(res.data.message);
			this.keepGettingHistory();
		});
	}

	render() {
		return (
			<div style={{padding: '3px'}}>
				{
					this.state.editorMode !== 'hidden'
					? <Editor
						editorMode={this.state.editorMode}
						toggleEditor={this.toggleEditor}
						id={this.props.thread._id}
				}

				<Feed 
					history={this.props.history}
				/>
			</div>
		);
	}
}

FeedContainer.propTypes = {
	history: PropTypes.arrayOf(PropTypes.shape({
		kind:       PropTypes.string.isRequired,
		author:     PropTypes.string.isRequired,
		_id:        PropTypes.string.isRequired,
		id:         PropTypes.string.isRequired,
		created:    PropTypes.number.isRequired,
		permalink:  PropTypes.string.isRequired,
		parentID:   PropTypes.string.isRequired,
		body: 	    PropTypes.string.isRequired
	}).isRequired).isRequired,
	thread: PropTypes.shape({
		_id:        PropTypes.string.isRequired,
		kind:       PropTypes.string.isRequired,
		id:         PropTypes.string.isRequired,
		permalink:  PropTypes.string.isRequired
	})
	appendToFeed:   PropTypes.func.isRequired,
	prependToFeed:  PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
	return { history: state.history };
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	appendToFeed: arr => dispatch(appendToFeed(arr)),
	prependToFeed: arr => dispatch(prependToFeed(arr))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FeedContainer);
