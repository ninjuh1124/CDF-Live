const TEST_COMMENT = {
	_id: 't3_a',
	id: 'a',
	kind: 'comment',
	thread: 't1_a',
	author: 'author',
	created: 0,
	permalink: 'https://redd.it/a/a',
	parentID: 't1_a',
	body: 'body'
};

const TEST_THREAD = {
	_id: 't3_a',
	id: 'a',
	kind: 'comment',
	thread: 't1_a',
	author: 'author',
	created: 0,
	permalink: 'link',
	parentID: 't1_a',
	body: 'body'
};

module.exports = ({
	history: async () => {
		return [TEST_COMMENT];
	},

	thread: async () => {
		return [TEST_THREAD];
	},

	comment: async () => {
		return TEST_COMMENT;
	}
});