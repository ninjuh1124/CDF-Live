
const snoowrap = require('snoowrap');
const dotenv = require('dotenv');

beforeAll(() => {
	dotenv.config({ path: './.env' });
})

describe('Reddit API test', () => {
	let config;
	let utils;
	let client;

	beforeAll(async () => {
		// initialize snoowrap client
		config = require('../dist/config');
		utils = require('../dist/utils');
		client = await new snoowrap(config.cred);
	});

	test('Reddit API Alive', async () => {
		// ping reddit for profile
		const profile = await client.getMe();
		expect(profile.name).toBe('thisismyanimealt');
	});

	test('Latest Thread', async () => {
		const threads = []

		// get latest listings
		await config.getLatestThreads(client).then(listing => {
			listing.forEach(submission => {
				threads.push(submission);
			});
		});

		// compare with CDF filter
		expect(config.isNewCdf(threads[0])).toBe(true);
	});

	test('Not CDF thread', async () => {
		const notCdf = await client.getSubmission('ab4kwv')
		expect(config.isNewCdf(notCdf)).toBe(false);
	});
})