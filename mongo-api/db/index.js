const mongoose = require('mongoose'),
	schemas = require('./schemas');

const uri = process.env.DB_CONNECTION_URI;

mongoose.connect(uri, { useNewUrlParser: true });
mongoose.connection.on(
	'error', console.error.bind(console, 'Console error: ')
);
mongoose.connection.once('open', () => {
	console.log('Database connected');
});

const Comment = mongoose.model('Comment', schemas.Comment);
const Thread = mongoose.model('Thread', schemas.Thread);

module.exports = {
	insertComment: (comment, callback) => {
		let c = new Comment(comment);
		c.save({}, callback);
	},

	insertComments: (comments, callback) => {
		comments.forEach(comment => {
			let c = new Comment(comment);
			c.save({}, err => {
				if (err) callback(err, c._id);
			});
			callback(null, 'success');
		})
	},

	insertThread: (thread, callback) => {
		let t = new Thread(thread);
		t.save({}, callback);
	},

	getComment: (filter, mask, options, callback) => {
		Comment.findOne(filter, mask, options, callback);
	},

	getComments: (filter, mask, options, callback) => {
		Comment.find(filter, mask, options, callback);
	},

	getThread: (filter, mask, options, callback) => {
		Thread.find(filter, mask, options, callback);
	},

	getThreads: (filter, mask, options, callback) => {
		Thread.find(filter, mask, options, callback);
	},

	editComment: (filter, doc, callback) => {
		Comment.updateOne(filter, doc, callback);
	},

	deleteComment: (filter, options, callback) => {
		Comment.deleteOne(filter, options, callback);
	},

	deleteThread: (filter, options, callback) => {
		Thread.deleteOne(filter, options, callback);
	}
};
