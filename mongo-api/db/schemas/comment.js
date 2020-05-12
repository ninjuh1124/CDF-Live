const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const commentSchema = new Schema({
	_id: String,
	id: String,
	kind: { type: String, default: 'comment' },
	thread: String,
	author: String,
	created: Number,
	permalink: String,
	parentID: String,
	body: String
});

const comment = mongoose.model('Comment', commentSchema);

module.exports = comment;
