import {
		APPEND_TO_FEED,
		PREPEND_TO_FEED,
		UPDATE_THREAD,
		SET_ACCESS_TOKEN,
		SET_REFRESH_TOKEN,
		EDIT_FEED,
		DELETE_FROM_FEED,
		SET_USER
	} from './actionTypes';

/**
 * appends comments to end of feed.
 * to be used for fetching comments older than oldest parent in feed.
 * payload MUST be an array
 * will automatically filter out comments already in feed.
 **/
export const appendToFeed = arr => ({
	type: APPEND_TO_FEED,
	payload: {
		...arr
	}
});

/**
 * prepends comments to beginning of feed.
 * to be used for fetching latest comments.
 * payload MUST be an array
 * will automatically filter out comments already in feed.
 **/
export const prependToFeed = comment => ({
	type: PREPEND_TO_FEED,
	payload: {
		...comment
	}
});

/**
 * updates thread object in store
 * payload must be object retrieved from api
 **/
export const updateThread = thread => ({
	type: UPDATE_THREAD,
	payload: {
		...thread
	}
});

/**
 * sets new user access token
 **/
export const setAccessToken = token => ({
	type: SET_ACCESS_TOKEN,
	payload: {
		accessToken: token
	}
});

/**
 * sets user refresh token
 **/
export const refreshToken = token => ({
	type: SET_REFRESH_TOKEN,
	payload: {
		refreshToken: token
	}
});

/**
 * edits comment in feed.
 * payload must contain '_id' field and new body text.
 **/
export const edit = comment => ({
	type: EDIT_FEED,
	payload: {
		...comment
	}
});

/**
 * deletes comment from feed.
 * payload must be fullname string (i.e. 't1_#######')
 **/
export const delete = comment => ({
	type: DELETE_FROM_FEED,
	payload: comment._id
});

/**
 * sets username
 **/
export const setUser = user => ({
	type: SET_USER,
	payload: user
});
