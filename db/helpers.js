const MongoClient = require('mongodb').MongoClient;

// comment handler
exports.maangeComment = (comment) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	MongoClient.connect(uri)
		.then(db => {
			db.collection('threads')
				.find()
				.toArray( (err, arr) => {
					if (arr.includes(comment.parent_id)) {
						store(handleComment(comment));
					}
				});
				db.close();
		})
		.catch(error => {
			console.log(error);
		});
};

// thread handler
exports.manageThread = (thread) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	if (isNewCDF(thread)) {
		MongoClient.connect(uri)
			.then(db => {
				db.insertOne(handleThread(thread));
			})
			.catch(error => {
				console.log(error);
			})
	}
};

// checks for new sticky
const isNewCDF = (obj) => {
	obj = obj.toJSON();
	return (
		['t2_6l4z3', 't2_6wrl6'].includes(obj.author_fullname)
		&& submission.title.includes("Casual Discussion Friday")
	);
}

// removes unnecessary object fields
const handleThread = (obj) => {
	obj = obj.toJSON();
	return {
		kind:		'submission',
		_id:		obj.name,
		id: 		obj.id,
		permalink: 	'https://redd.it/' + obj.id
	};
}

const handleComment = (obj) => {
	obj = obj.toJSON();
	return {
		kind: 		'comment',
		author: 	obj.author,
		_id: 		obj.name,
		id: 		obj.id,
		created: 	obj.created_utc,
		permalink: 	'https://reddit.com' + obj.permalink,
		parentID: 	obj.parent_id,
		body: 		obj.body
	};
}

// stores obj to appropraite collection
const store = (obj) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	obj = obj.toJSON();
	let collection;
	if (obj.kind === 'comment') collection = 'comments';
	else if (obj.kind === 'submission') collection = 'threads';

	MongoClient.connect(uri)
		.then(db => {
			db.collection(collection)
				.insertOne(obj);
			db.close();
		})
		.catch(error => {
			console.log(error);
		});
};
