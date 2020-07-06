import { config } from 'dotenv';
import * as snoostorm from 'snoostorm';
import * as snoowrap from 'snoowrap';
import { makeReq, mapComment, isNewCdf, mapSubmission } from './utils';

config({ path: './.env' });

const cred = {
	userAgent: process.env.REDDIT_USER_AGENT,
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.REDDIT_CLIENT_SECRET,
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD
};
console.log(cred);
const client = new snoowrap(cred);
const threads: string[] = [];

// get latest thread ids
client.search({
	query: 'Casual Discussion Friday',
	subreddit: 'anime',
	sort: 'new',
	time: 'week'
}).then((listing: snoowrap.Listing<snoowrap.Submission>) => {
	listing.forEach((submission: snoowrap.Submission) => {
		threads.push(submission.name)
	});
}).catch(err => { });

// listen for new content
const comments = new snoostorm.CommentStream(client, {
	subreddit: 'anime',
	limit: 100,
	pollTime: 10 * 1000
});

const submissions = new snoostorm.SubmissionStream(client, {
	subreddit: 'anime',
	limit: 50,
	pollTime: 15 * 60 * 1000
});

// send filtered content to db
comments.on('item', (item: snoowrap.Comment) => {
	if (threads.includes(item.link_id)) {
		makeReq('/comment', [mapComment(item)]);
	}
});

submissions.on('item', (item: snoowrap.Submission) => {
	if (isNewCdf(item)) {
		threads.unshift(item.name);
		threads.pop();
		makeReq('/thread', mapSubmission(item));
	}
})