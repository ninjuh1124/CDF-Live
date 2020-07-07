import axios from 'axios';
import snoowrap = require('snoowrap');
import { Comment } from './comment.model'
import { Thread } from './thread.model';

axios.defaults.headers.post['Authorization'] = process.env.REDDIT_CLIENT_SECRET;
axios.defaults.baseURL = process.env.DB_SERVICE;

const makeReq = (uri: string, body: any) => {
	return axios.post(uri, body);
}

// check if submission should be processed
const isNewThread = (submission: snoowrap.Submission, filter: (submssion: snoowrap.Submission) => boolean): boolean => {
	return filter(submission);
}

// adhere comment to db model
const mapComment = (comment: snoowrap.Comment): Comment => {
	return {
		kind: 'comment',
		author: comment.author.name,
		_id: comment.name,
		id: comment.id,
		thread: comment.link_id,
		created: comment.created_utc,
		permalink: `https://reddit.com${comment.permalink}`,
		parentID: comment.parent_id,
		body: comment.body
	}
}

// adhere submission to db model
const mapSubmission = (submission: snoowrap.Submission): Thread => {
	return {
		kind: 'submission',
		_id: submission.name,
		id: submission.id,
		permalink: `https://redd.it/${submission.id}`
	}
}

export { makeReq, mapComment, mapSubmission, isNewThread };