const helpers = require('./helpers'),
	fs = require('fs');

module.exports = {
	about: (req, res) => {
		fs.readFile('content/about.md', (err, body) => {
			helpers.send(res, err, body.toString('utf8'));
		});
	}
}
