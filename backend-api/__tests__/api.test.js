const app = require('../app.js');
const appConfig = require('../appConfig');
const request = require('supertest');

jest.mock('../services/dbService');
jest.mock('../services/redditService');

appConfig(app);

describe('DB Service', () => {
	test('history', async () => {
		const res = await request(app).get('/v1/history.json');
		expect(JSON.parse(res.text)).toEqual(
			expect.objectContaining({
				message: expect.arrayContaining([
					expect.objectContaining({
						kind: 'comment'
					})
				])
			})
		);
	});

	test('thread', async () => {
		const res = await request(app).get('/v1/thread.json');
		expect(JSON.parse(res.text)).toEqual(
			expect.objectContaining({
				message: expect.arrayContaining([
					expect.objectContaining({
						kind: 'submission'
					})
				])
			})
		);
	});
});

describe('Reddit Service', () => {
	test('token via code', async () => {
		const res = await request(app).get('/v1/token.json?code=CODE');
		expect(JSON.parse(res.text)).toEqual(
			expect.objectContaining({
				message: expect.objectContaining({
					access_token: 'foo',
					refresh_token: 'bar'
				})
			})
		);
	});

	test('token via refresh', async () => {
		const res = await request(app).get('/v1/token.json?refresh_token=TOKEN');
		expect(JSON.parse(res.text)).toEqual(
			expect.objectContaining({
				message: expect.objectContaining({
					access_token: 'foo'
				})
			})
		);
	});
});