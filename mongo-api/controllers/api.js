const {
	send,
	refreshHistory,
	generateHistory,
	getComment,
	getComments,
	getThread,
	insertComments,
	insertThread,
	editComment,
	deleteComment,
	deleteThread
} = require('./helpers');

module.exports = ({
	history: (req, res) => {
		if (req.query.newerThan) {
			refreshHistory(req.query.newerThan, (err, arr) => {
				send(res, err, arr);
			});
		} else {
			generateHistory(
				{ olderThan: req.query.olderThan, count: req.query.count },
				(err, arr) => {
					send(res, err, arr);
				}
			);
		}
	},

	getComment: (req, res) => {
		getComment(req.query, (err, comment) => {
			send(res, err, comment);
		});
	},

	getThread: (req, res) => {
		getThread(req.query, (err, thread) => {
			send(res, err, thread);
		});
	},

	insertComments: (req, res) => {
		insertComments(req.query, (err, data) => {
			send(res, err, data);
		});
	},

	insertThread: (req, res) => {
		insertThread(req.query, (err, data) => {
			send(res, err, data);
		});
	},

	deleteComment: (req, res) => {
		deleteComment(req.query, (err, data) => {
			send(res, err, data);
		});
	},

	deleteThread: (req, res) => {
		deleteThread(req.query, (err, data) => {
			send(res, err, data);
		});
	},

	editComment: (req, res) => {
		editComment(req.query, (err, data) => {
			send(res, err, data);
		});
	}
});
