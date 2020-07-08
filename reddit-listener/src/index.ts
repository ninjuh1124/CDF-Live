import * as dotenv from 'dotenv';
import * as snoowrap from 'snoowrap';
import { makeReq, mapComment, isNewThread, mapSubmission } from './utils';
import {
	cred,
	isNewCdf,
	commentStream as cs,
	submissionStream as ss,
	getLatestThreads
} from './config';

dotenv.config({ path: './.env' });

// initialize reddit
const client = new snoowrap(cred);

// get latest thread ids
const threads: string[] = [];
getLatestThreads(client).then((listing: snoowrap.Listing<snoowrap.Submission>) => {
	listing.forEach((submission: snoowrap.Submission) => {
		threads.push(submission.name)
	});
});

// initialize listeners
const commentStream = cs(client);
const submissionStream = ss(client);

// send filtered content to db
commentStream.on('item', (item: snoowrap.Comment) => {
	if (threads.includes(item.link_id)) {
		makeReq('/comment', { comments: [mapComment(item)] });
	}
});

submissionStream.on('item', (item: snoowrap.Submission) => {
	if (isNewThread(item, isNewCdf)) {
		threads.unshift(item.name);
		threads.pop();
		makeReq('/thread', { thread: mapSubmission(item) });
	}
})