exports.makeError = (err, msg) => {
	var e = new Error(msg);
	e.code = err;
	return e;
}

exports.sendSuccess = (res, data) =>  {
	res.writeHead(200, {"Content-Type" : "application/json"});
	var output = {error: null, data: data};
	res.end(JSON.stringify(output) + "\n");
}

exports.sendFailure = (res, code, err) => {
	var code = (err.code) ? err.code : err.name;
	res.writeHead(code, {"Content-Type" : "application/json"});
	res.end(JSON.stringify({
		error: code,
		message: err.message
	}) +"\n");
}

exports.invalid_resource = () => {
	return {
		error: "invalid_resource",
		message: "the requested resource does not exist"
	};
}

exports.loadThreadList = (callback) => {
	let uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
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
exports.handleComment = (comment) => {
	comment = comment.toJSON();

	return {
		'kind': 'comment',
		'author': comment.author,
		'_id': comment.name,	// prefixed id, t3_asdf, used for indexing
		'id': comment.id,		// not prefixed id, asdf, used for sorting
		'permalink': 'https://reddit.com' + comment.permalink + '?context=10',
		'parentID': comment.parent_id,
		'body': comment.body
	}
}

// stores json objects to database
exports.store = (obj) => {
	let uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
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
exports.getHistory = ( req, callback) => {
	let uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
	let olderThan = req.query.olderthan ? req.query.olderthan : "zzzzzzz";
	let count = req.query.count ? req.query.count : 75;
	MongoClient.connect(uri, (error, db) => {
		db.collection("comments")
			.aggregate([
				{"$sort": {'id': -1}},
				{"$match": {'id': {'$lt': olderThan}}},
				{"$limit": count},
				{"$sort": {'id': 1}}
			])
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
exports.getParents = (req, callback) => {
	let count = req.query.count ? req.query.count : 75;
	let nt = req.query.newerthan ? req.query.newerthan : '0';
	let uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";

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
exports.getChildren = (req, callback) => {
	let nt = req.query.newerthan ? req.query.newerthan : '0';
	let id = req.query.id ? req.query.id : null;
	let uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";

	if (id === null) callback(invalid_resource());

	MongoClient.connect(uri, (error, db) => {
		db.collection('comments')
			.aggregate([
				{ $match: { $and: [
					{ parentID: id },
					{ _id: { $gt: nt }}
				]}},
				{ $sort: { _id: -1 }}
			])
			.toArray( (err, arr) => {
				callback(null, arr);
				db.close();
			});
	});
}

exports.isNewCDF = (submission) => {
	submission = submission.toJSON();
	return (submission.author_fullname == 't2_6l4z3' && submission.title.includes("Casual Discussion Friday"));
}

// converts snoowrap submission object to json
exports.handleThread = (submission) => {
	submission = submission.toJSON();
	return {
		'kind': 'submission',
		'_id': submission.name,
		'permalink': 'https://reddit.com' + submission.permalink
	}
}

// gets newest thread from database for callback
exports.getLatestThread = (callback) => {
	let uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
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
exports.getComment = (id, callback) => {
	let uri = process.env.MONGO_URI ? process.env.MONGO_URI : "mongodb://localhost/CDF-Live";
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
exports.getFaces = (callback) => {
	fs.readFile('commentfaces.json', 'utf8', (err, contents) => {
		if (err) callback(err);
		callback(null, JSON.parse(contents));
	});
}
