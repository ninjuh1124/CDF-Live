const axios = require('axios'),
	querystring = require('querystring');

const uri = process.env.REDDIT_SERVICE_URI;

module.exports = ({/**
	 * Gets a new token from the reddit api.
	 * Returns a refresh/access pair if supplied a code
	 * or an access token if supplied a refresh token.
	 **/
	getToken: async ({ code, refreshToken }) => {
		if (!code && !refreshToken) throw new Error('NoAuthorization');

		try {
			return await axios.post(`${uri}/v1/token`, { code, refreshToken })
				.then(res => {
				})
				.catch(err => {
					console.error(err);
				});
		} catch (err) {
			throw err;
		}
	}
});
/*
module.exports = ({
	getUser: accessToken => {
		return fetch(
			'https://oauth.reddit.com/api/v1/me',
			{ headers: { Authorization: `Bearer ${accessToken}` }}
		)
			.then(res => res.json())
	},

	getToken: ({ code, refreshToken }) => {
		if (!code && !refreshToken) throw new Error("NoAuthorization");

		const auth = "Basic " +
			Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');

		const headers = {
			Authorization: auth,
			'Content-Type': 'application/x-www-form-urlencoded'
		};

		let body;

		if (code) {
			body = querystring.stringify({
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: process.env.REDDIT_REDIRECT
			});
		} else if (refreshToken) {
			body = querystring.stringify({
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			});
		}

		const request = {
			method: "POST",
			headers,
			body
		};

		return fetch('https://www.reddit.com/api/v1/access_token', request)
			.then(res => res.json());
	}
});*/
