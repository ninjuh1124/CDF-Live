const helpers = require('./helpers'),
	fs = require('fs');

module.exports = {
	about: (req, res) => {
		fs.readFile('../content/about.md', (err, contents) => {
			helpers.send(res, err, contents.toString('utf8'));
		});
	}
}
