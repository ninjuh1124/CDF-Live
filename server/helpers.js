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

exports.handleComment = (comment) => {
	comment = comment.toJSON();

	return {
		'kind': 'comment',
		'author': comment.author,
		'_id': comment.name,
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

exports.isNewCDF = (submission) => {
	submission = submission.toJSON();
	return (submission.author_fullname == 't2_6l4z3' && submission.title.includes("Casual Discussion Friday"));
}

exports.handleThread = (submission) => {
	submission = submission.toJSON();
	return {
		'kind': 'submission',
		'_id': submission.name,
		'permalink': 'https://reddit.com' + submission.permalink
	}
}
