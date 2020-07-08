const mongoose = require('mongoose'),
	Schema = mongoose.Schema;

module.threadSchema = new Schema({
	_id: String,
	id: String,
	kind: { type: String, default: 'submission' },
	permalink: String
});
