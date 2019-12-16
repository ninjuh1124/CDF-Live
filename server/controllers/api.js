module.exports = db => {
	const helpers = require('./helpers'),
		commentService = require('../services/comments')(db),
		threadService = require('../services/threads')(db),
		redditService = require('../services/reddit');

	return {
		history: (req, res) => {
			let query = {
				count: req.query.count,
				newerThan: req.query.newerthan,
				olderThan: req.query.olderthan
			};

			commentService.history(query)
				.then(comments => helpers.send(res, null, comments))
				.catch(err => {
					helpers.send(res, {
						code: 500,
						message: `Something went wrong: ${err}`
					});
				});
		},

		thread: (req, res) => {
			threadService.thread()
				.then(thread => helpers.send(res, null, thread))
				.catch(err => {
					helpers.send(res, {
						code: 500,
						message: `Something went wrong: ${err}`
					});
				});
		},

		comment: (req, res) => {
			commentServices.comment(req.query.id)
				.then(comment => helpers.send(res, null, comment))
				.catch(err => {
					const error = { message: err.message };
					switch (err.message) {
						case "NoIDSupplied":
							error.code = 400;
							break;
						case "CommentNotFound":
							error.code = 404;
							break;
						default:
							error.message = `Something went wrong: ${err}`;
							error.code = 500;
					}
					helpers.send(res, error);
				});
		},

		token: (req, res) => {
			const query = {
				code: req.query.code,
				refreshToken: req.query.refresh_token
			};

			redditService.getToken(query)
				.then(r => helpers.send(res, null, r))
				.catch(err => {
					const error = {};
					switch (err.message) {
						case "NoAuthorization":
							error.code = 400;
							error.message = "Insufficient parameters";
							break;
						default:
							error.code = 500;
							error.message = `Something went wrong: ${err}`;
					}
					helpers.send(res, error);
				});
		},

		editComment: (req, res) => {
			const query = {
				_id: req.body._id,
				accessToken: req.body.token,
				body: req.body.body
			};

			commentService.editComment(query)
				.then(r => helpers.send(res, null, "success"))
				.catch(err => {
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
							error.message = `Something went wrong: ${err}`;
					}
					helpers.send(res, error);
				});
		},

		deleteComment: (req, res) => {
			const query = {
				_id: req.body._id,
				accessToken: req.body.token
			};

			commentService.editComment(query)
				.then(r => helpers.send(res, null, "success"))
				.catch(err => {
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
							error.message = `Something went wrong: ${err}`;
					}
					helpers.send(res, error);
				});
		}
	}
}
