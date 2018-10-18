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
