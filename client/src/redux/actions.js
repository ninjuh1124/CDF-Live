import {
		APPEND_TO_FEED,
		PREPEND_TO_FEED,
		UPDATE_THREAD,
		SET_ACCESS_TOKEN,
		SET_REFRESH_TOKEN,
		EDIT_FEED,
		DELETE_FROM_FEED,
		HIDE,
		SAVE,
		UPVOTE,
		SET_USER,
		LOGOUT
	} from './actionTypes';

/**
 * appends comments to end of feed.
 * to be used for fetching comments older than oldest parent in feed.
 * payload MUST be an array
 * will automatically filter out comments already in feed.
 **/
export const appendToFeed = arr => ({
	type: APPEND_TO_FEED,
	payload: arr
});

/**
 * prepends comments to beginning of feed.
 * to be used for fetching latest comments.
 * payload MUST be an array
 * will automatically filter out comments already in feed.
 **/
export const prependToFeed = arr => ({
	type: PREPEND_TO_FEED,
	payload: arr
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
export const setRefreshToken = token => ({
	type: SET_REFRESH_TOKEN,
	payload: {
		refreshToken: token
	}
});

/**
 * edits comment in feed.
 * payload must contain '_id' field and new body text.
 **/
export const editFeed = comment => ({
	type: EDIT_FEED,
	payload: {
		...comment
	}
});

/**
 * deletes comment from feed.
 * payload must be fullname string (i.e. 't1_#######')
 **/
export const deleteFromFeed = comment => ({
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

/**
 * removes all login information from client
 **/
export const logout = () => ({
	type: LOGOUT,
	payload: null
});

/**
 * toggles status of post being upvoted
 **/
export const upvote = _id => ({
	type: UPVOTE,
	payload: _id
})

/**
 * toggles visibility of post
 **/
export const hide = _id => ({
	type: HIDE,
	payload: _id
})

/**
 * toggles status of post being saved
 **/
export const save = _id => ({
	type: SAVE,
	payload: _id
})
