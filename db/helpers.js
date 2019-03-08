const MongoClient = require('mongodb').MongoClient;

exports.loadThreads = (callback) => {
	let uri = process.env.MONGO_URI ? process.env.MONGO_URI : 'mongodb://localhost/fridaydotmoe';
	MongoClient.connect(uri)
		.then(db => {
			db.collection('threads')
				.find({ kind: 'submission' })
				.toArray( (err, arr) => {
					callback(null, arr);
					db.close();
				});
		})
		.catch(err => {
			callback(err);
		});
}

// checks for new sticky
exports.isNewCDF = (obj) => {
	obj = obj.toJSON();
	return (
		['t2_6l4z3', 't2_6wrl6'].includes(obj.author_fullname)
		&& obj.title.includes("Casual Discussion Friday")
	);
}

// removes unnecessary object fields
exports.handleThread = (obj) => {
	obj = obj.toJSON();
	console.log(obj.id);
	return {
		kind:		'submission',
		_id:		obj.name,
		id: 		obj.id,
		permalink: 	'https://redd.it/' + obj.id
	};
}

exports.handleComment = (obj) => {
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
exports.store = (obj) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
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
