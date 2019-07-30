const dotenv = require('dotenv'),
	snoowrap = require('snoowrap'),
	snoostorm = require('snoostorm')
	MongoClient = require('mongodb').MongoClient;

dotenv.load();

const cred = {
	userAgent:      process.env.REDDIT_USER_AGENT,
	clientId:       process.env.REDDIT_CLIENT_ID,
	clientSecret:   process.env.REDDIT_CLIENT_SECRET,
	username:       process.env.REDDIT_USERNAME,
	password:       process.env.REDDIT_PASSWORD
};

var threads = [];

const listener = new snoostorm(cred);

MongoClient.connect(
	(process.env.MONGO_URI ?
		process.env.MONGO_URI :
		'mongodb://localhost/fridaydotmoe')
).then(pool => {
	const helpers = require('./helpers')(pool);

	/*
	const reddit = new snoowrap(cred);

	reddit.config({
		requestDelay: 5000,
		debug: true
	});
	*/

	helpers.loadThreads( (err, arr) => {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		threads = arr.map(d => d._id);
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
});

