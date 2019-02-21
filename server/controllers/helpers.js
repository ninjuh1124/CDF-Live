exports.send = (res, err, d) => {
	let code, data;
	if (err) {
		code = err.code ? err.code : err.name;
		data = err.message ? err.message : null;
	} else {
		code = 200;
		data = d;
	}

	res.status(code).json({ message: data });
}
