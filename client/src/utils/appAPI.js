import axios from 'axios';
import querystring from 'querystring';

const appAPI = process.env.REACT_APP_API;

/**
 *
 * Bindings for app routes
 *
 * All are async functions that return data within the 'data' field supplied by axios
 * 
 * Calls to these functions should supply their own catch block
 *
 **/

export const query = endpoint => {
	return axios
		.get(`${appAPI}${endpoint}`, { crossdomain: true })
		.then(res => res.data);
};

export const getThread = () => {
	return axios
		.get(`${appAPI}v1/thread.json`, { crossdomain: true })
		.then(res => res.data.message);
};

export const getAccessToken = refreshToken => {
	return axios
		.get(
			`${appAPI}v1/token.json?refresh_token=${refreshToken}`,
			{ crossdomain: true }
		)
		.then(res => {
			if (res.data.message.access_token) return res.data.message.access_token;
			else throw new Error('accessToken request made successfully, but did not return accessToken');
		});
};

export const getRefreshToken = async (code) => {
	return axios
		.get(
			`${appAPI}v1/token.json?code=${code}`,
			{ crossdomain: true }
		)
		.then(res => {
			if (res.data.message.refresh_token) {
				return res.data.message;
			} else throw new Error('refreshToken request made successfully, but did not return refreshToken');
		});
}

export const getHistory = newerThan => {
	let uri = `${appAPI}v1/history.json`;
	if (newerThan) uri = uri + `?newerthan=${newerThan}`;
	return axios.get(uri, { crossdomain: true })
		.then(res => {
			if (
				res.data.message && 
				Array.isArray(res.data.message) && 
				res.data.message.length > 0
			) {
				return res.data.message;
			} else if (
				res.data.message && 
				Array.isArray(res.data.message) && 
				res.data.message.length === 0
			) return [];
			else throw new Error('history request made successfully, but did not return history');
		});
};

export const loadMore = olderThan => {
	return axios
		.get(
			`${appAPI}v1/history.json?olderthan=${olderThan}`,
			{ crossdomain: true }
		)
		.then(res => {
			if (
				res.data.message && 
				Array.isArray(res.data.message) && 
				res.data.message.length > 0
			) {
				return res.data.message;
			} else if (
				res.data.message && 
				Array.isArray(res.data.message) && 
				res.data.message.length === 0
			) return null;
			else throw new Error('history request made successfully, but did not return history');
		});
}

export const deleteComment = ({ accessToken, _id }) => {
	return axios
		.post(`${appAPI}v1/delete`, {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				_id,
				token: accessToken,
			})
		})
		.then(res => res.data.message);
};

export const editComment = ({ accessToken, _id, body }) => {
	return axios
		.post(`${appAPI}v1/edit`, {
			headers: {
				'Content-type': 'application/x-www-form-urlencoded'
			},
			data: querystring.encode({
				_id,
				body,
				token: accessToken
			})
		})
		.then(res => res.data.message);
};
