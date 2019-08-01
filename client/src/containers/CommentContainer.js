import Comment from '../components/Comment';

import { connect } from 'react-redux';

import { prependToFeed,
	editFeed,
	deleteFromFeed,
	upvote,
	hide } from '../redux/actions';

const mapStateToProps = (state, ownProps) => ({
	isHidden: state.feed.hidden.includes(ownProps._id),
	children: state.feed.history
		.filter(comment => !state.feed.hidden.includes(ownProps._id))
		.filter(comment => comment.parentID === ownProps._id),
	isLoggedIn: state.reddit.isLoggedIn,
	loggedInAs: state.reddit.loggedInAs
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	prependToFeed: arr => dispatch(prependToFeed(arr)),
	editFeed: comment => dispatch(editFeed(comment)),
	deleteFromFeed: () => dispatch(deleteFromFeed(ownProps._id)),
	upvote: () => dispatch(upvote(ownProps._id)),
	hide: () => dispatch(hide(ownProps._id))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Comment);
