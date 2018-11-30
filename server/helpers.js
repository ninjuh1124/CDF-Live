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
	let uri = process.env.MONGO_URI || "mongodb://localhost/CDF-Live";
	MongoClient.connect(uri, (error, db) => {
		if (err) {
			console.log("Could not load thread list\n");
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
		'body': comment.body,
		'body_html': markdown.toHTML(comment.body)
	}
}

// stores json objects to database
exports.store = (obj) => {
	let uri = process.env.MONGO_URI || "mongodb://localhost/CDF-Live";
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
exports.getHistory = (callback) => {
	let uri = process.env.MONGO_URI || "mongodb://localhost/CDF-Live";
	MongoClient.connect(uri, (error, db) => {
		db.collection("comments")
			.aggregate([
				{"$sort": {'id': -1}},
				{"$limit": 50},
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
	let uri = process.env.MONGO_URI || "mongodb://localhost/CDF-Live";
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
	let uri = process.env.MONGO_URI || "mongodb://localhost/CDF-Live";
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
