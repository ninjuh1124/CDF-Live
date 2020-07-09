import axios from 'axios';
import * as snoowrap from 'snoowrap';
import * as express from 'express';

const reddit = new snoowrap({
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD,
	userAgent: process.env.REDDIT_USER_AGENT,
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.REDDIT_CLIENT_SECRET
});

/**
 * Helper function to send data back to client
 * @param res Express response object
 * @param err Error object or any other kind of error message. Set to `null` if no errors
 * @param d Data to send
 */
const send = (res: express.Response, err: any, d?: any) => {
	let code: number;
	let data: any;
	if (err) {
		code = err.code ? err.code : 500;
		data = err.message ? err.message : 'InternalError';
	} else {
		code = 200;
		data = d ? d : null;
	}

	res.status(code).json({ error: err, message: data });
}

/**
 * Gets reddit user json data based on given access token
 * @param req Express request object. Should contain @query object containing @accessToken string
 * @param res Express response object
 */
export const apiController = ({
	getUser: async (req: express.Request, res: express.Response) => {
		if (req.query.accessToken === null) throw new Error('NoAuthorization');

		try {
			const user = await axios.get(
				'https://oauth.reddit.com/api/me',
				{ headers: { Authorization: `Bearer ${req.query.accessToken}` } }
			).then(r => r.data);
			send(res, null, user);
		} catch (err) {
			send(res, err);
		}
	},

	/**
	 * Gets reddit access as per OAuth2 flow
	 * @param req Express request object. Should contain @query object with either @code or @refreshToken
	 * @param res Express response object
	 */
	getToken: async (req: express.Request, res: express.Response) => {
		if (req.query.code === null && req.query.refreshToken === null) {
			throw new Error('NoAuthorization');
		}

		try {
			let data;
			if (req.query.code) {	// TOKEN VIA CODE
				data = await reddit.credentialedClientRequest.call({
					clientId: process.env.REDDIT_CLIENT_ID,
					clientSecret: process.env.REDDIT_CLIENT_SECRET,
					userAgent: process.env.REDDIT_USER_AGENT
				}, {
					method: 'post',
					baseUrl: 'https://www.reddit.com',
					uri: 'api/v1/access_token',
					form: {
						grant_type: 'authorization_code',
						code: req.query.code,
						redirect_uri: process.env.REACT_APP_REDIRECT
					}
				});

			} else if (req.query.refreshToken) {	// TOKEN VIA REFRESH
				data = await reddit.credentialedClientRequest.call({
					clientId: process.env.REDDIT_CLIENT_ID,
					clientSecret: process.env.REDDIT_CLIENT_SECRET,
					userAgent: process.env.REDDIT_USER_AGENT
				}, {
					method: 'post',
					baseUrl: 'https://www.reddit.com',
					uri: 'api/v1/access_token',
					form: {
						grant_type: 'refresh_token',
						refresh_token: req.query.refreshToken
					}
				});
			}

			// SEND TOKEN
			send(res, null, data);
		} catch (err) {
			send(res, err);
		}
	}
});