const MongoClient = require('mongodb').MongoClient,
	fs = require('fs');

const makeError = exports.makeError = (err, msg) => {
	var e = new Error(msg);
	e.code = err;
	return e;
}

const sendSuccess = exports.sendSuccess = (res, data) =>  {
	res.writeHead(200, {"Content-Type" : "application/json"});
	var output = {error: null, data: data};
	res.end(JSON.stringify(output) + "\n");
}

const sendFailure = exports.sendFailure = (res, code, err) => {
	var code = (err.code) ? err.code : err.name;
	res.writeHead(code, {"Content-Type" : "application/json"});
	res.end(JSON.stringify({
		error: code,
		message: err.message
	}) +"\n");
}

const invalid_resource = exports.invalid_resource = () => {
	return {
		error: "invalid_resource",
		message: "the requested resource does not exist"
	};
}

const loadThreadList = exports.loadThreadList = (callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
	MongoClient.connect(uri, (error, db) => {
		if (error) {
			console.log("Could not load thread list\n");
			console.log(error);
			process.exit(1);
		}
		db.collection('threads')
			.find({'kind': 'submission'})
			.toArray( (err, arr) => {
				callback(null, arr);
				db.close();
			});
//	}).catch( (err) => {
//		callback(err);
	});
}

// takes a snoowrap comment object and coverts to a more usable json
const handleComment = exports.handleComment = (comment) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
	comment = comment.toJSON();

	return {
		'kind': 'comment',
		'author': comment.author,
		'_id': comment.name,	// prefixed id
		'id': comment.id,		// not prefixed id
		'created': comment.created_utc,
		'permalink': 'https://reddit.com' + comment.permalink + '?context=10',
		'parentID': comment.parent_id,
		'body': comment.body
	}
}

// stores json objects to database
const store = exports.store = (obj) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
	if (obj.kind == 'comment') {
		MongoClient.connect(uri, (err, db) => {
			db.collection('comments').insertOne(obj);
			db.close();
//		}).catch( (err) => {
//			// fuck if I know...
		});
	} else if (obj.kind == 'submission') {
		MongoClient.connect(uri, (err, db) => {
			db.collection('threads').insertOne(obj);
			db.close();
//		}).catch( (err) => {

		});
	}
}

// collects newest comments to array for callback function
const getHistory = exports.getHistory = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
	let aggregation = [{ $sort: { id: -1 }}];

	if (req.query.olderthan) {
		aggregation.push({ $match: { _id: { $lt: req.query.olderthan }}});
	}
	if (req.query.newerthan) {
		aggregation.push({ $match: { _id: { $gt: req.query.newerthan }}});
	}

	let count = req.query.count ? req.query.count : 50;
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

// gets top level parents. really should've just stored the 'depth,' but I should've done a lot of things.
const getParents = exports.getParents = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
	let count = req.query.count ? req.query.count : 25;
	let nt = req.query.newerthan ? req.query.newerthan : '0';

	MongoClient.connect(uri, (error, db) => {
		db.collection('comments')
			.aggregate([
				{ $match: { $and: [
					{ parentID: { $gt: 't3_000000' }},
					{ _id: { $gt: nt }}
				]}},
				{ $sort: { _id: -1 }},
				{ $limit: count }
			])
			.toArray( (err, arr) => {
				callback(null, arr);
				db.close();
			});
	});
}

// gets children of a specific comment by id
const getChildren = exports.getChildren = (id, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
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

// builds comment tree to flattened array
// sorted by depth ascending, then by _id descending
const getTree = exports.getTree = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
	let arrToReturn = [];
	getParents(req, (err, arr) => {
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

const isNewCDF = exports.isNewCDF = (submission) => {
	submission = submission.toJSON();
	return (submission.author_fullname == 't2_6l4z3' && submission.title.includes("Casual Discussion Friday"));
}

// converts snoowrap submission object to json
const handleThread = exports.handleThread = (submission) => {
	submission = submission.toJSON();
	return {
		'kind': 'submission',
		'_id': submission.name,
		'permalink': 'https://reddit.com' + submission.permalink
	}
}

// gets newest thread from database for callback
const getLatestThread = exports.getLatestThread = (callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
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

// gets one comment by _id
const getComment = exports.getComment = (req, callback) => {
	const uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
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

const getAbout = exports.getAbout = (callback) => {
	fs.readFile('about.md', (err, contents) => {
		if (err) callback(err);
		callback(null, contents.toString('utf8'));
	});
}
