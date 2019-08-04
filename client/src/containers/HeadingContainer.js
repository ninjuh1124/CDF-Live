import Heading from '../components/Heading';

import { setUser,
	setAccessToken,
	updateThread,
	logout,
	upvote } from '../redux/actions';

import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	refreshToken: state.reddit.refreshToken,
	accessToken: state.reddit.accessToken,
	isLoggedIn: state.reddit.isLoggedIn,
	loggedInAs: state.reddit.loggedInAs,
	thread: state.feed.thread
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	setUser: user => dispatch(setUser(user)),
	setAccessToken: token => dispatch(setAccessToken(token)),
	updateThread: thread => dispatch(updateThread(thread)),
	logout: () => dispatch(logout()),
	upvote: _id => dispatch(upvote(_id))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Heading);
