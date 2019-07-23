import React from 'react';
import Heading from '../components/Heading';

import { setUser,
	setAccessToken,
	updateThread } from '../redux/actions';

import { connect } from 'redux';

const mapStateToProps = (state, ownProps) => ({
	refreshToken: state.refreshToken,
	accessToken: state.accessToken,
	isLoggedIn: state.isLoggedIn,
	loggedInAs: state.loggedInAs,
	thread: state.thread
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	setUser: user => dispatch(setUser(user)),
	setAccessToken: token => dispatch(setActionToken(token))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Heading);
