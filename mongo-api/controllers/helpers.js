const db = require('../db');
const redditService = require('../services/redditService');

module.exports = {
	send: (res, err, d) => {
		let code;
		if (err) {
			code = err.code ? err.code : 500;
		} else {
			code = 200;
		}

		let data = d ? d : null;

		res.status(code).json({ error: err, message: data });
	},

	refreshHistory: (newerThan, callback) => {
		db.getComments(
			{ _id: { $gt: newerThan } },
			null,
			{ sort: { _id: -1 } },
			callback
		)
	},

	generateHistory: (query = { olderThan: null, count: 50 }, callback) => {
		db.getComments(
			{
				parentID: /^t3_\S+$/,
				_id: query.olderThan ?
					{ $lt: query.olderThan } :
					/^t1_\S+$/
			},

			'_id',

			{
				sort: { _id: -1 },
				limit: 1,
				skip: query.count ? query.count : 50
			},

			(err, id) => {
				db.getComments(
					{
						$and: [
							{ _id: { $gte: id[0] } },
							{
								_id: query.olderThan ?
									{ $lt: query.olderThan } :
									/^t1_\S+$/
							}
						]
					},
					null,
					{ sort: { _id: -1 } },
					callback
				)
			}
		);
	},

	getComment: (query, callback) => {
		db.getComment(query.id, null, null, callback);
	},

	getThread: (query, callback) => {
		db.getThread(null, null, { sort: { _id: -1 }, limit: 1 }, callback);
	},

	insertComments: (comments, callback) => {
		db.insertComments(comments, callback);
	},

	insertThread: (thread, callback) => {
		db.insertThread(thread, callback);
	},

	deleteThread: (query, callback) => {
		db.deleteThread({ _id: query._id }, {}, callback);
	},

	deleteComment: async (query, callback) => {
		try {
			const [rUser, dbUser] = await Promise.all([
				// user according to reddit
				redditService.getUser(query.accessToken),
				// user according to db
				db.getComment({ _id: query._id }).exec(comment => comment.author)
			]);

			// verify
			if (rUser === dbUser) {
				db.deleteComment({ _id: query._id }, {}, callback);
			} else {
				throw new Error('Unauthorized');
			}
		} catch (err) {
			// error in promise
			callback(err);
		}
	},

	editComment: async (query, callback) => {
		try {
			const [rUser, dbUser] = await Promise.all([
				// user according to reddit
				redditService.getUser(query.accessToken),
				// user according to db
				db.getComment({ _id: query._id }).exec(comment => comment.author)
			]);

			// verify
			if (rUser === dbUser) {
				db.editComment(query._id, query.body, callback);
			} else {
				throw new Error('Unauthorized');
			}
		} catch (err) {
			// error in promise
			callback(err);
		}

	}
};
