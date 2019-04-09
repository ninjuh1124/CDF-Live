const MongoClient = require('mongodb').MongoClient,
	helpers = require('./helpers');

module.exports = {
	history: (req, res) => {
		refreshHistory(req, (err, arr) => {
			helpers.send(res, err, arr);
		});
	},
	
	commenttree: (req, res) => {
		generateHistory(req, (err, arr) => {
			helpers.send(res, err, arr);
		});
	},

	thread: (req, res) => {
		getLatestThread( (err, arr) => {
			helpers.send(res, err, arr);
		});
	},

	comment: (req, res) => {
		getComment(req, (err, data) => {
			helpers.send(res, err, data);
		});
	}
}

const generateHistory = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	let count = req.query.count ? parseInt(req.query.count) : 50;

	MongoClient.connect(uri, (error, db) => {
		db.collection("comments")
			.find({ parentID: { $gt: 't3_000000' }})
			.sort({ id: -1 })
			.skip(count)
			.limit(1)
			.toArray( (err, arr) => {
				if (err) callback(err);
				db.collection("comments")
					.aggregate([
						{ $sort: { id: -1 }},
						{ $match: { _id: { $gte: arr[0]._id }}},
						{ $sort: { id: 1 }}
					])
					.toArray( (e, arr) => {
						if (e) callback(e);
						callback(null, arr);
						db.close();
					});
			});
	});
}

const refreshHistory = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	let aggregation = [{ $sort: { id: -1 }}];

	if (req.query.olderthan) {
		aggregation.push({ $match: { _id: { $lt: req.query.olderthan }}});
	}
	if (req.query.newerthan) {
		aggregation.push({ $match: { _id: { $gt: req.query.newerthan }}});
	}

	let count = req.query.count ? parseInt(req.query.count) : 50;
	aggregation.push({ $limit: count });
	aggregation.push({ $sort: { id: 1 }});

	MongoClient.connect(uri, (error, db) => {
		db.collection("comments")
			.aggregate(aggregation)
			.toArray( (err, arr) => {
				if (err) {
					callback(err);
				}
				callback(null, arr);
				db.close();
			});
	});
}

const getLatestThread = (callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	MongoClient.connect(uri, (error, db) => {
		db.collection('threads')
			.find({})
			.sort({"_id": -1})
			.limit(1)
			.toArray( (err, arr) => {
				if (err) {
					callback(err);
				}
				callback(null, arr);
				db.close();
			});
//	}).catch( (err) => {
//		callback(err);
	});
}

const getComment = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	let id = req.query.id ? req.query.id : null;

	if (id === null) callback(invalid_resource());
	
	MongoClient.connect(uri, (error, db) => {
		db.collection('comments')
			.find({'_id': id})
			.toArray( (err, arr) => {
				if (err) {
					callback(err);
				}
				callback(null, arr[0]);
				db.close();
			});
//	}).catch( (err) => {
//		callback(err);
	});
}

