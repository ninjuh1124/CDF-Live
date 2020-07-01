const COMMENTS = [
	{
		"_id": "t1_fwk0000",
		"author": "author 1",
		"body": "parent comment",
		"created": 1593610000,
		"id": "fwk0000",
		"kind": "comment",
		"parentID": "t3_hfx4xn",
		"permalink": "link_to_parent",
		"thread": "t3_hfx4xn"
	},
	{
		"_id": "t1_fwk0001",
		"author": "author 2",
		"body": "child comment",
		"created": 1593610000,
		"id": "fwk0001",
		"kind": "comment",
		"parentID": "t1_fwk0000",
		"permalink": "link_to_child",
		"thread": "t3_hfx4xn"
	}
];

const THREAD = [
	{
		_id: 't3_hfx4xn',
		id: 'hfx4xn',
		kind: 'submission',
		permalink: 'https://redd.it/hfx4xn'
	}
];

module.exports = ({
	history: async () => {
		return COMMENTS;
	},

	thread: async () => {
		return THREAD;
	},

	comment: async () => {
		return COMMENTS[0];
	}
});