exports.send = (res, err, d) => {
	let code;
	if (err) {
		code = err.code ? err.code : 500;
	} else {
		code = 200;
	}

	let data = d ? d : null;

	res.status(code).json({ error: err, message: data });
	return ({ error: err, message: data });
}
