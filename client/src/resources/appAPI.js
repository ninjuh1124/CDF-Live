import axios from 'axios';
import querystring from 'querystring';

const appAPI = process.env.REACT_APP_API;

/**
 *
 * Bindings for app routes
 *
 * All are async functions that return data within the 'data' field supplied by axios
 * 
 * Calls to these functions should be annoyingly enclosed in try/catch blocks
 *
 **/
export const getThread = async () => {
	const res = await axios.get(`${appAPI}v1/thread.json`,
		{ crossdomain: true }
	);
	return res.data;
};

export const getAccessToken = async (refreshToken) => {
	const res = await axios.get(
		`${appAPI}v1/token.json?refresh_token=${refreshToken}`,
		{ crossdomain: true }
	);
	return res.data;
};

export const getRefreshToken = async (code) => {
	const res = await axios.get(
		`${appAPI}v1/token.json?code=${code}`,
		{ crossdomain: true }
	);

	return res.data;
}

export const getHistory = async (newerThan) => {
	const res = await axios.get(
		`${appAPI}v1/history.json?newerthan=${newerThan}`,
		{ crossdomain: true }
	);

	if (
		res.data.message && 
		Array.isArray(res.data.message) && 
		res.data.message.length > 0
	) {
		return res.data;
	} else return [];
};

export const loadMore = async (olderThan) => {
	const res = await axios.get(
		`${appAPI}v1/history.json?olderthan=${olderThan}`,
		{ crossdomain: true }
	);

	if (
		res.data.message && 
		Array.isArray(res.data.message) && 
		res.data.message.length > 0
	) {
		return res.data;
	}
}

export const deleteComment = async ({ accessToken, _id }) => {
	const res = await axios({
		method: 'post',
		url: `${appAPI}v1/delete`,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		data: querystring.encode({
			_id,
			token: accessToken,
		})
	});

	return res.data;
};

export const editComment = async ({ accessToken, _id, body }) => {
	const res = await axios({
		method: 'post',
		url: `${appAPI}v1/edit`,
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		},
		data: querystring.encode({
			_id,
			body,
			token: accessToken
		})
	});

	return res.data;
};
