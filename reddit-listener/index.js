const dotenv = require('dotenv'),
	snoowrap = require('snoowrap'),
	utils = require('./helpers'),
	snoostorm = require('snoostorm');

dontenv.load();

const {
	REDDIT_USER_AGENT,
	REDDIT_CLIENT_ID,
	REDDIT_CLIENT_SECRET,
	REDDIT_USERNAME,
	REDDIT_PASSWORD
} = process.env;

const cred = {
	userAgent:		REDDIT_USER_AGENT,
	clientId:		REDDIT_CLIENT_ID,
	clientSecret:	REDDIT_CLIENT_SECRET,
	username:		REDDIT_USERNAME,
	password:		REDDIT_PASSWORD
};

const client = new snoowrap(cred);

const threads = [];

client.search({
	query: '',
	subreddit: 'anime',
	sort: 'new',
	time: 'week'
}).then(listing => {
	listing.forEach(submission => threads.push(submission.name))
});

const comments = new snoostorm.CommentStream(client, {
	subreddit: 'anime',
	limit: 100,
	pollTime: 10*1000
});

const submissions = new snoostorm.SubmissionStream(client, {
	subreddit: 'anime',
	limit: 50,
	pollTime: 15*60*1000
});

comments.on('item', item => {
	item = item.toJSON();
	if (threads.includes(item.link_id)) {
		utils.handleComment(item);
	}
});

submissions.on('item', item => {
	item = item.toJSON();
	if (utils.isNewCDF(item)) {
		utils.handleThread(item);
		threads.unshift(item.name);
		threads.pop();
	}
});
