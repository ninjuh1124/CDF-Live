import Comment from '../components/Comment';

import { connect } from 'react-redux';

import { prependToFeed,
	editFeed,
	deleteFromFeed,
	upvote,
	hide,
	save } from '../redux/actions';

const mapStateToProps = (state, ownProps) => ({
	isHidden: state.feed.hidden.includes(ownProps._id),
	isSaved: state.feed.saved.includes(ownProps._id),
	isUpvoted: state.feed.upvoted.includes(ownProps._id),
	ownPost: state.reddit.loggedInAs === ownProps.author,
	children: state.feed.history
		.filter(comment => comment.parentID === ownProps._id),
	isLoggedIn: state.reddit.isLoggedIn,
	accessToken: state.reddit.accessToken
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	prependToFeed: arr => dispatch(prependToFeed(arr)),
	editFeed: comment => dispatch(editFeed(comment)),
	deleteFromFeed: () => dispatch(deleteFromFeed(ownProps._id)),
	upvote: (_id = ownProps._id) => dispatch(upvote(_id)),
	hide: () => dispatch(hide(ownProps._id)),
	save: () => dispatch(save(ownProps._id))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Comment);
