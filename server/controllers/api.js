const fetch = require('node-fetch'),
	querystring = require('querystring'),
	helpers = require('./helpers');

module.exports = (db) => {
	/** DRIVER METHODS **/
	const history = (req, callback) => {
		let count = req.query.count ? parseInt(req.query.count) : 50;
	
		// someday i'll switch to a database schema that allows subqueries
		if (req.query.newerthan) {		// refreshing client-side history
			db.collection('comments')
				.aggregate([
					{ $sort: { _id: -1 }},
					{ $match: { _id: { $gt: req.query.newerthan }}}
				])
				.toArray( (err, arr) => {
					if (err) callback(err);
					callback(null, arr);
				});
		} else {						// generating first or next 'page'
			db.collection('comments')
				.aggregate([
					{ $match: { $and: [
						{ parentID: { $regex: /^t3_\S+$/ }},
						{ _id: { $lt: req.query.olderthan
							? req.query.olderthan
							: 't1_zzzzzzz' }}
					]}},
					{ $sort: { _id: -1 }},
					{ $limit: count }
				])
				.toArray( (err, arr) => {
					if (err) callback(err);
					db.collection('comments')
						.aggregate([
							{ $sort: { _id: -1 }},
							{ $match: { $and: [
								{ _id: { $gte: arr[arr.length-1]._id }},
								{ _id: { $lt: req.query.olderthan
									? req.query.olderthan
									: 't1_zzzzzzz' }}
							]}}
						])
						.toArray( (e, a) => {
							if (e) callback(e);
							callback(null, a);
						})
				})
		}
	}

	const getLatestThread = (callback) => {
		db.collection('threads')
			.find({})
			.sort({"_id": -1})
			.limit(1)
			.toArray( (err, arr) => {
				if (err) {
					callback(err);
				}
				callback(null, arr);
			});
	}

	const getComment = (req, callback) => {
		let id = req.query.id ? req.query.id : null;

		if (id === null) callback(invalid_resource());
	
		db.collection('comments')
			.find({'_id': id})
			.toArray( (err, arr) => {
				if (err) {
					callback(err);
				}
				callback(null, arr[0]);
			});
	}

	const getToken = (req, callback) => {
		let refreshToken = req.query.refresh_token ? 
				req.query.refresh_token : 
				null;
		let code = req.query.code ? req.query.code : null;
		let auth = "Basic " + 
				Buffer.from(process.env.REDDIT_CLIENT_ID + 
				':' + 
				process.env.REDDIT_CLIENT_SECRET)
				.toString('base64');
		let url = "https://www.reddit.com/api/v1/access_token";

		if (auth == null) {
			let error = {
				code: 500,
				message: "Could not authorize request"
			}

			callback(error);
		}

		let headers = {
			Authorization: auth,
			'Content-Type': 'application/x-www-form-urlencoded'
		};

		let body;

		if (code !== null) {
			body = querystring.stringify({
				grant_type: 'authorization_code',
				code: code,
				redirect_uri: process.env.REDDIT_REDIRECT
			});
		} else if (refreshToken !== null) {
			body = querystring.stringify({
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			});
		} else {
			let error = {
				code: 400,
				message: "Insufficient parameters"
			};

			callback(error);
		}

		let request = {
			method: "POST",
			headers: headers,
			body: body
		};

		fetch(url, request)
			.then(res => res.json())
			.then(res => callback(null, res))
			.catch(err => callback(err));
	}

	/** ROUTER SEES FOLLOWING JSON **/
	return {
		history: (req, res) => {
			history(req, (err, arr) => {
				helpers.send(res, err, arr);
			});
		},

		thread: (req, res) => {
			getLatestThread( (err, arr) => {
				helpers.send(res, err, arr);
			});
		},

		comment: (req, res) => {
			getComment(req, (err, data) => {
				helpers.send(res, err, data);
			});
		},

		token: (req, res) => {
			getToken(req, (err, data) => {
				helpers.send(res, err, data);
			});
		}
	}
}

