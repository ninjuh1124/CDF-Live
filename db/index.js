const dotenv = require('dotenv'),
	snoowrap = require('snoowrap'),
	snoostorm = require('snoostorm');

const helpers = require('./helpers');

dotenv.load();

const cred = {
	userAgent: process.env.REDDIT_USER_AGENT,
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.REDDIT_CLIENT_SECRET,
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD
};

const reddit = new snoowrap(cred);
const anime = reddit.getSubreddit('anime');
const listener = new snoostorm(cred);

reddit.config({
	requestDelay: 5000,
	debug: true
});

const threadStream = listener.SubmissionStream({
	subreddit: 'anime',
	results: 100,
	polltime: 60000
});

const commentStream = listener.CommentStream({
	subreddit: 'anime',
	results: 100,
	polltime: 5000
});

commentStream.on('comment', comment => helpers.manageComment);
threadStream.on('submission', thread => helpers.manageThread);
