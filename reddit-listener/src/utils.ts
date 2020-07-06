import axios from 'axios';
import Snoowrap = require('snoowrap');
import { Comment } from './comment.model'
import { Thread } from './thread.model';

axios.defaults.headers.post['Authorization'] = process.env.REDDIT_CLIENT_SECRET;
axios.defaults.baseURL = process.env.DB_SERVICE;

const makeReq = (uri: string, body: any) => {
	return axios.post(uri, body);
}

// check if submission should be processed
const isNewCdf = (submission: Snoowrap.Submission): boolean => {
	const approvedSubmitters = [];
	const title = 'Casual Discussion Friday';
	return (
		approvedSubmitters.includes(submission.author_fullname) &&
		submission.title.includes(title)
	);
}

// adhere comment to db model
const mapComment = (comment: Snoowrap.Comment): Comment => {
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
const mapSubmission = (submission: Snoowrap.Submission): Thread => {
	return {
		kind: 'submission',
		_id: submission.name,
		id: submission.id,
		permalink: `https://redd.it/${submission.id}`
	}
}

export { makeReq, mapComment, mapSubmission, isNewCdf };