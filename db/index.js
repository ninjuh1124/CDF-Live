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

var threads = [];

helpers.loadThreads( (err, arr) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	threads = arr.map(d => d._id);
});

const reddit = new snoowrap(cred);
const listener = new snoostorm(cred);

reddit.config({
	requestDelay: 5000,
	debug: true
});

const commentStream = listener.CommentStream({
	subreddit: 'anime',
	results: 100,
	polltime: 10000
});

const submissionStream = listener.SubmissionStream({
	subreddit: 'anime',
	results: 50,
	polltime: 30000
});

commentStream.on('comment', comment => {
	if (threads.includes(comment.link_id)) {
		helpers.store(helpers.handleComment(comment));
	}
});
submissionStream.on('submission', thread => {
	if (helpers.isNewCDF(thread)) {
		helpers.store(helpers.handleThread(thread));
		threads.unshift(thread.name);
		threads.pop();
	}
});
