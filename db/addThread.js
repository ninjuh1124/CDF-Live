const snoowrap = require('snoowrap'),
	helpers = require('./helpers'),
	MongoClient = require('mongodb').MongoClient,
	dotenv = require('dotenv');

if (process.argv.length < 3) {
	console.log("Provide thread name");
	process.exit(1);
}

dotenv.load();

let uri = process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost/fridaydotmoe';
MongoClient.connect(uri)
	.then(db => {
		db.collection('threads').update(
			{ _id: "t3_" + process.argv[2] },
			{ $set: {
				id: process.argv[2],
				kind: "submission",
				permalink: "https://redd.it/" + process.argv[2]
			}},
			{ upsert: true }
		);
	}).catch(err => {
		console.log(err);
	});

const reddit = new snoowrap({
	userAgent: "asdf",
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.REDDIT_CLIENT_SECRET,
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD
});

reddit.getSubmission(process.argv[2]).fetch()
	.then(sub => {
		addToDb(sub.comments);
	})
	.then( () => {
		process.exit(0);
	});

let addToDb = arr => {
	for (let i=1; i<arr.length; i++) {
		helpers.store(helpers.handleComment(arr[i]));
		if (arr[i].replies.length > 0) {
			addToDb(arr[i].replies);
		}
	}
}
