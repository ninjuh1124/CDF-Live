const api = require('../controllers/api');

describe('api test', () => {
	test('history', () => {
		expect(api.history()).resolves;
	});

	test('thread', () => {
		expect(api.thread()).resolves;
	});
});