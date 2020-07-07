import snoowrap = require('snoowrap');
import snoostorm = require('snoostorm')

const approvedSubmitters = ['t2_6wrl6'];
const title = 'Casual Discussion Friday';

export const cred = {
	userAgent: process.env.REDDIT_USER_AGENT,
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.REDDIT_CLIENT_SECRET,
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD
};

export const isNewCdf = (submission: snoowrap.Submission): boolean => {
	return (
		approvedSubmitters.includes(submission.author_fullname) &&
		submission.title.includes(title)
	);
}

export const getLatestThreads = (client: snoowrap) => {
	return client.search({
		query: 'Casual Discussion Friday',
		subreddit: 'anime',
		sort: 'new',
		time: 'week'
	});
}

// listen for new content
export const commentStream = (client: snoowrap) => {
	return new snoostorm.CommentStream(client, {
		subreddit: 'anime',
		limit: 100,
		pollTime: 10 * 1000
	});
}

export const submissionStream = (client: snoowrap) => {
	return new snoostorm.SubmissionStream(client, {
		subreddit: 'anime',
		limit: 50,
		pollTime: 15 * 60 * 1000
	});
}