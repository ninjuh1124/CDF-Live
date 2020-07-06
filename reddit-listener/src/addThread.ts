import * as snoowrap from 'snoowrap';
import { config } from 'dotenv';
import { Comment } from './comment.model';
import { mapComment, makeReq, mapSubmission } from './utils';

config({ path: './.env' });

if (process.argv.length < 3) {
	process.exit(1);
}

const reddit = new snoowrap({
	userAgent: process.env.REDDIT_USER_AGENT,
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.REDDIT_CLIENT_SECRET,
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD
});

const c: Comment[] = [];

reddit.getSubmission(process.argv[2])
	.expandReplies({ limit: 50, depth: 8 })
	.then((submission: snoowrap.Submission) => {
		makeReq('/thread', mapSubmission(submission));
		prepare(submission.comments);
		makeReq('/comment', c);
	});

const prepare = (comments: snoowrap.Comment[]): void => {
	comments.forEach((comment: snoowrap.Comment): void => {
		c.push(mapComment(comment));
		prepare(comment.replies);
	});
}