const { send } = require('./helpers'),
	dbService = require('../services/dbService'),
	redditService = require('../services/redditService');

module.exports = ({
	history: async (req, res) => {
		let query = {
			count: req.query.count,
			newerThan: req.query.newerthan,
			olderThan: req.query.olderthan
		};

		try {
			const history = await dbService.history(query)
			return send(res, null, history);
		} catch (err) {
			return send(res, {
				code: (err.code ? err.code : 500),
				message: `${err}`
			});
		}
	},

	thread: async (req, res) => {
		try {
			const thread = await dbService.thread();
			return send(res, null, thread);
		} catch (err) {
			return send(res, {
				code: 500,
				message: err.message ? err.message : `${err}`
			});
		}
	},

	comment: async (req, res) => {
		try {
			const comment = await dbService.comment(req.query.id);
			return send(res, null, comment);
		} catch (err) {
			const error = { message: err.message };
			switch (err.message) {
				case "NoIDSupplied":
					error.code = 400;
					break;
				case "CommentNotFound":
					error.code = 404;
					break;
				default:
					error.message = err.message ? err.message : `Something went wrong: ${err}`;
					error.code = 500;
			}
			return send(res, error);
		}
	},

	token: async (req, res) => {
		const query = {
			code: req.query.code,
			refreshToken: req.query.refresh_token
		};

		try {
			const r = await redditService.getToken(query);
			return send(res, null, r);
		} catch (err) {
			const error = {};
			switch (err.message) {
				case "NoAuthorization":
					error.code = 400;
					error.message = "Insufficient parameters";
					break;
				default:
					error.code = 500;
					error.message = err.message ? err.message : `Something went wrong: ${err}`;
			}
			return send(res, error);
		}
	},

	editComment: async (req, res) => {
		const query = {
			_id: req.body._id,
			accessToken: req.body.token,
			body: req.body.body
		};
		try {
			const r = await redditService.editComment(query);
			return send(res, null, "success")
		} catch (err) {
			const error = {};
			switch (err.message) {
				case "UserNotValid":
					error.code = 403;
					error.message = "Unauthorized";
					break;
				case "CommentNotFound":
					error.code = 404;
					error.message = "Comment not found";
					break;
				case "NoIDSupplied":
					error.code = 400;
					error.message = "Bad request";
					break;
				default:
					error.code = 500;
					error.message = err.message ? err.message : `Something went wrong: ${err}`;
			}
			return send(res, error);
		}
	},

	deleteComment: async (req, res) => {
		const query = {
			_id: req.body._id,
			accessToken: req.body.token
		};
		try {
			const r = redditService.editComment(query);
			return send(res, null, "success");
		} catch (err) {
			const error = {};
			switch (err.message) {
				case "UserNotValid":
					error.code = 403;
					error.message = "Unauthorized";
					break;
				case "CommentNotFound":
					error.code = 404;
					error.message = "Comment not found";
					break;
				case "NoIDSupplied":
					error.code = 400;
					error.message = "Bad request";
					break;
				default:
					error.code = 500;
					error.message = err.message ? err.message : `Something went wrong: ${err}`;
			}
			send(res, error);
		}
	}
})
