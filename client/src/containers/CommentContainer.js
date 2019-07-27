import Comment from '../components/Comment';

import { connect } from 'react-redux';

import { prependToFeed,
	editFeed,
	deleteFromFeed } from '../redux/actions';

const mapStateToProps = (state, ownProps) => ({
	children: state.history
		.filter(comment => comment.parentID === ownProps._id),
	isLoggedIn: state.isLoggedIn,
	loggedInAs: state.loggedInAs
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	prependToFeed: arr => dispatch(prependToFeed(arr)),
	editFeed: comment => dispatch(editFeed(comment)),
	deleteFromFeed: () => dispatch(deleteFromFeed(ownProps._id))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Comment);
