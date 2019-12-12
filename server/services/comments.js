const fetch = require('node-fetch'),
	redditService = require('./reddit');

module.exports = db => ({
	/**
	 * Returns promise of an array of comments
	 * Calls should have their own catch statement
	 **/
	history: ({ count, newerThan, olderThan }) => {
		count = count ? count : 50;

		if (newerThan) {		// refreshing client-side history
			return db
				.collection('comments')
				.aggregate([
					{ $sort: { _id: -1 }},
					{ $match: { _id: { $gt: newerThan }}}
				])
				.toArray();
		} else {				// generating first or next 'page'
			return db
				.collection('comments')
				.aggregate([
					{ $match: { $and: [
						{ parentID: { $regex: /^t3_\S+$/ }},
						{ _id: { $lt: olderThan
							? olderThan
							: 't1_zzzzzzz' }}
					]}},
					{ $sort: { _id: -1 }},
					{ $limit: count }
				])
				.toArray()
				.then(arr => arr[arr.length-1]._id)
				.then(_id => {
					return db
						.collection('comments')
						.aggregate([
							{ $sort: { _id: -1 }},
							{ $match: { $and: [
								{ _id: { $gte: _id }},
								{ _id: { $lt: olderThan
									? olderThan
									: 't1_zzzzzzz' }}
							]}}
						])
						.toArray();
				});
		}
	},

	/**
	 * Returns promise to a single comment object
	 * Calls to this should be caught where called
	 **/
	comment: _id => {
		if (!_id) throw new Error("NoIDSupplied");

		return db.collection('comments')
			.find({ '_id': _id })
			.toArray()
			.then(arr => {
				if (arr.length > 0) return arr[0];
				else throw new Error("CommentNotFound");
			});
	},

	/** TODO: figure out why getUser is returning 401 **/

	/**
	 * Returns promise
	 * Calls to this should be caught where called
	 **/
	deleteComment: async function({ _id, accessToken }) {
		/** Validate identity **/
		const redditID = redditService
			.getUser(accessToken)
			.then(res => res.name);

		const dbID = this.comment(_id)
			.then(comment => comment.author);

		try {
			const [r, d] = await Promise.all(redditID, dbID)
			/** Do operation **/
			if (r === d) {
				return db
					.deleteOne({
						author: r,
						_id: _id,
					})
					.then(() => "success");
			} else throw new Error("UserNotValid");
		} catch(err) {
			throw err;
		}
	},

	/**
	 * Returns promise
	 * Calls to this should be caught where called
	 **/
	editComment: async function({ _id, accessToken, body }) {
		/** Validate identity **/
		const redditID = redditService
			.getUser(accessToken)
			.then(res => res.name);

		const dbID = this.comment(_id)
			.then(comment => comment.author);

		try {
			const [r, d] = await Promise.all([redditID, dbID])
			/** Do operation **/
			if (r === d) {
				return db
					.updateOne(
						{
							author: r,
							_id: _id,
						},
						{ $set: { body: body}},
						{ upsert: false }
					)
					.then(() => "success");
			} else throw new Error("UserNotValid");
		} catch(err) {
			throw err;
		}
	}
});
