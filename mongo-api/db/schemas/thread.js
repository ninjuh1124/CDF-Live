const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

const threadSchema = new Schema({
	_id: String,
	id: String,
	kind: { type: String, default: 'submission' },
	permalink: String
});

const thread = mongoose.model('Thread', threadSchema);

module.exports = thread;
