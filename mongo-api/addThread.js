const snoowrap = require('snoowrap'),
	MongoClient = require('mongodb').MongoClient,
	dotenv = require('dotenv');

if (process.argv.length < 3) {
	console.log("Provide thread name");
	process.exit(1);
}

dotenv.load();

const reddit = new snoowrap({
	userAgent: "asdf",
	clientId: process.env.REDDIT_CLIENT_ID,
	clientSecret: process.env.REDDIT_CLIENT_SECRET,
	username: process.env.REDDIT_USERNAME,
	password: process.env.REDDIT_PASSWORD
});

let uri = process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost/fridaydotmoe';
MongoClient.connect(uri)
	.then(db => {
		const helpers = require('./helpers')(db);
		db.collection('threads').update(
			{ _id: "t3_" + process.argv[2] },
			{ $set: {
				id: process.argv[2],
				kind: "submission",
				permalink: "https://redd.it/" + process.argv[2]
			}},
			{ upsert: true }
		);

		reddit.getSubmission(process.argv[2]).fetch()
			.then(sub => {
				addToDb(sub.comments);
			})
			.then( () => {
				db.close();
				process.exit(0);
			});

		let addToDb = arr => {
			for (let i=1; i<arr.length; i++) {
				console.log("Adding comment: " + arr[i].name);
				helpers.store(helpers.handleComment(arr[i]));
				if (arr[i].replies.length > 0) {
					addToDb(arr[i].replies);
				}
			}
		}
	}).catch(err => {
		console.log(err);
	});
