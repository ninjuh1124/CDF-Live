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
		'body_html': comment.body_html
			.replace('&lt;', '<')
			.replace('&gt;', '>')
			.replace('<a href="/u/', '<a href="https://reddit.com/u/')
			.replace('<a href="/r/', '<a href="https://reddit.com/r/')
			.replace('<p>', '<p class="text-justify">')
	}
}

// stores json objects to database
exports.store = (obj) => {
	let uri = process.env.MONGO_URI || "mongodb://localhost/CDF-Live";
	if (obj.kind == 'comment') {
		MongoClient.connect(uri, (err, db) => {
			db.collection('comments').insertOne(obj);
			db.close();
		});
	} else if (obj.kind == 'submission') {
		MongoClient.connect(uri, (err, db) => {
			db.collection('threads').insertOne(obj);
			db.close();
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

/* PROBABLY GOING TO COMPLETELY REWRITE THIS
// give the man who invented regex a medal. then shoot him.
handleCommentFaces = (html) => {
	let faceCodes = {
		// TODO: add face codes
	};
	let regex = /<a href="#\S+"( title=".*"){0,1}>((".*"){0,1}<strong>.*<\/strong>|.*){0,1}<\/a>/g;
	let faces = html.match(regex);

	if (faces != null) {
		faces.forEach(element => {
			element
				.replace(/<a /, '<div class="container"><img ')	// <a> tag to <img> tag
				.replace(/href=/, 'src=')	// href to src
				.replace(/#\S+/, faceCodes[element.match(/#S+/)])	// #facecode to facecode.ext
				// top text, seriously fuck this line
				.replace(/(?<=(<a href="#\S+( title=".*"){0,1}>))(?<!(<strong>))(\w.*|"\w.*")(?=(<strong>\w.*<\/strong>){0,1}<\/a>)/, '<div class="top-text">' + element.match(/(((?<=(<a href="#\S+( title=".*"){0,1}>))(?<!(<strong>))\w.*(?=(<\/a>)))|((?<=(<a href="#\S+( title=".*"){0,1}>")(?<!(<strong>)))\w.*(?=("<strong>.*<\/strong><\/a>))))/) + '</div>')
				.replace(/<strong>/, '<div class="bottom">')	// strong tags
				.replace(/</strong/, '</div'>
				.replace(/<\/a>/, '</div>');	
		});
	}
}
*/

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
	});
}
