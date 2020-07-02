const axios = require('axios');
const snoowrap = require('snoowrap');
const { send } = require('helpers');

const reddit = new snoowrap({
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD,
	userAgent: process.env.REDDIT_USER_AGENT,
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET
});

module.exports = ({
	getUser: async (req, res) => {
		if (req.query.accessToken === null) throw new Error('NoAuthorization');
		try {
			const name = await axios.get(
				'https://oauth.reddit.com/api/me',
				{ headers: { Authorization: `Bearer ${req.query.accessToken}` } }
			).then(r => r.data.name);
			send(res, null, name);
		} catch (err) {
			send(res, err);
		}
	},

	getToken: async (req, res) => {
		try {
			if (req.query.code) {
				const data = await reddit.credentialedClientRequest({
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					userAgent: process.env.USER_AGENT
				}, {
					method: 'post',
					baseUrl: 'https://www.reddit.com',
					uri: 'api/v1/access_token',
					form: {
						grant_type: 'authorization_code',
						code: req.query.code,
						redirect_uri: process.env.REACT_APP_REDIRECT
					}
				})

				send(res, null, data);
			} else if (req.query.refreshToken) {
				const data = await reddit.credentialedClientRequest({
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					userAgent: process.env.USER_AGENT
				}, {
					method: 'post',
					baseUrl: 'https://www.reddit.com',
					uri: 'api/v1/access_token',
					form: {
						grant_type: 'refresh_token',
						refresh_token: req.query.refreshToken
					}
				})

				send(res, null, data);
			} else throw new Error('NoAuthorization')
		} catch (err) {
			send(res, err);
		}
	}
});