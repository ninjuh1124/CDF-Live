const MongoClient = require('mongodb').MongoClient,
	helpers = require('./helpers');

module.exports = {
	history: (req, res) => {
		getHistory(req, (err, arr) => {
			helpers.send(res, err, arr);
		});
	},
	
	parenthistory: (req, res) => {
		getParents(req, (err, arr) => {
			helpers.send(res, err, arr);
		});
	},

	children: (req, res) => {
		getChildren(req, (err, arr) => {
			helpers.send(res, err, arr);
		});
	},

	commenttree: (req, res) => {
		getTree(req, (err, arr) => {
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

const getHistory = (req, callback) => {
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

const getParents = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	let aggr = [];
	let match = {
		$match: {
			$and: []
		}
	}

	match.$match.$and.push({ parentID: { $gt: 't3_000000' }});
	req.query.newerthan
	? match.$match.$and.push({ _id: { $gt: req.query.newerthan }})
	: null;

	aggr.push(match);
	aggr.push({ $sort: { _id: -1 }})
	req.query.count
	? aggr.push({ $limit: parseInt(req.query.count) })
	: aggr.push({ $limit: 75 });

	MongoClient.connect(uri, (error, db) => {
		db.collection('comments')
			.aggregate(aggr)
			.toArray( (err, arr) => {
				callback(null, arr);
				db.close();
			});
	});
}

const getChildren = (id, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	if (id === null) callback(invalid_resource());

	MongoClient.connect(uri, (error, db) => {
		db.collection('comments')
			.aggregate([
				{ $match: { parentID: id }},
				{ $sort: { _id: -1 }}
			])
			.toArray( (err, arr) => {
				callback(null, arr);
				db.close();
			});
	});
}

const getTree = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/fridaydotmoe";
	let arrToReturn = [];
	getParents(req, (err, arr) => {
		console.log(arr);
		if (err) callback(err);
		arrToReturn = [...arr];
		
		MongoClient.connect(uri, (error, db) => {
			(function iter(i) {
				if (i === arrToReturn.length) {
					callback(null, arrToReturn);
					db.close();
					return;
				}

				db.collection('comments')
					.aggregate([
						{ $match: { parentID: arrToReturn[i]._id }},
						{ $sort: { _id: -1 }}
					])
					.toArray( (err, arr) => {
						arrToReturn = [...arrToReturn, ...arr];
						iter(i+1);
					})
			})(0);
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

