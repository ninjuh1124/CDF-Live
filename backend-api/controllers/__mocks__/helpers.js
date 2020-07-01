exports.send = (res, err, d) => {
	if (err) throw err;
	console.log(d);
	return d;
}