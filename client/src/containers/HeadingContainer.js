import React from 'react';
import Heading from '../components/Heading';

import { setUser,
	setAccessToken,
	updateThread } from '../redux/actions';

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
	setAccessToken: token => dispatch(setAccessToken(token))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Heading);
