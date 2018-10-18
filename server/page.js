var helpers = require('./helpers.js'),
	fs = require('fs'),
	path = require('path');

exports.generate = (req, res) => {
	var page = 'home';
	console.log("\tServing page: " + page);

	fs.readFile('template.html', (err, contents) => {
		if (err) {
			helpers.sendFailure(res, 500, err);
			return;
		}

		contents = contents.toString('utf8');
		contents = contents.replace("{{PAGE_NAME}}", page);

		res.writeHead(200, {"Content-Type": "text/html"});
		res.end(contents);
	});
}
