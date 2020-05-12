const axios = require('axios');

axios.defaults.headers.post['Authorization'] = process.env.REDDIT_CLIENT_SECRET;
axios.defaults.baseURL = process.env.MONGO_SERVICE;

const makeReq = (uri, body) => {
	axios.post(uri, body)
		.then(res => {
			console.log(`Added: ${body.id} ${(new Date()).toJSON()}`);
		})
		.catch(err => {
			console.error(`Error: ${err} ${(new Date()).toJSON()}`);
		});
}

module.exports = {

	isNewCDF: submission => {
		return (
			approvedSubmitters.includes(submission.author_fullname) &&
			submission.title.includes(title)
		);
	},

	handleComment: comment => {
		objToSend = {
			kind: 'comment',
			author: comment.author,
			_id: comment.name,
			id: comment.id,
			thread: comment.link_id,
			created: comment.created_utc,
			permalink: `https://reddit.com/${comment.permalink}`,
			parentID: comment.parent_id,
			body: comment.body
		};

		makeReq('/comments/comment', objToSend);
	},

	handleSubmission: submission => {
		objToSend = {
			kind: 'submission',
			_id: submission.name,
			id: submission.id,
			permalink: `https://redd.it/${submission.id}`
		};

		makeReq('/threads/thread', objToSend);
	},

};
