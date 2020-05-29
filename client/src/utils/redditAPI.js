import axios from 'axios';
import querystring from 'querystring';

/**
 *
 * Bindings for reddit's api. 
 *
 * All calls to the api should be made from here.
 *
 * All functions return promises who's returns should be handled
 * outside of here.
 *
 **/

// Generic request, really shouldn't have to use this
export const request = (uri, options) => {
	return axios({
		method: options.method,
		url: uri,
		headers: options.headers,
		data: querystring.encode(options.data)
	});
};

export const getMe = accessToken => {
	return axios
		.get(
			'https://oauth.reddit.com/api/v1/me',
			{
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}
		)
		.then(res => res.data);
};

export const deletePost = ({ accessToken, _id }) => {
	return axios({
		method: 'post',
		url: 'https://oauth.reddit.com/api/del',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: querystring.encode({
			id: _id
		})
	});
};

export const savePost = ({ accessToken, _id }) => {
	return axios({
		method: 'post',
		url: 'https://oauth.reddit.com/api/save',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: querystring.encode({
			id: _id
		})
	});
};

export const unsavePost = ({ accessToken, _id }) => {
	return axios({
		method: 'post',
		url: 'https://oauth.reddit.com/api/unsave',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: querystring.encode({
			id: _id
		})
	});
};

export const upvotePost = ({ accessToken, _id, dir }) => {
	return axios({
		method: 'post',
		url: 'https://oauth.reddit.com/api/vote',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		data: querystring.encode({
			id: _id,
			dir
		})
	});
};

export const editPost = ({ accessToken, _id, body }) => {
	return axios({
		method: 'post',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		url: 'https://oauth.reddit.com/api/editusertext',
		data: querystring.encode({
			text: body,
			api_type: 'json',
			thing_id: _id
		})
	});
};

export const commentPost = ({ accessToken, parent_id, body }) => {
	return axios({
		method: 'post',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		url: 'https://oauth.reddit.com/api/comment',
		data: querystring.encode({
			text: body,
			api_type: 'json',
			thing_id: parent_id
		})
	}).then(res => res.data.json.data.things[0].data);
};