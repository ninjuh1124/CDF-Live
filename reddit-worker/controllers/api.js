const axios = require('axios');
const snoowrap = require('snoowrap');

const reddit = new snoowrap({
	username: 'foo',
	password: 'bar',
	userAgent: 'baz',
	clientId: 'bax',
	clientSecret: 'baw'
});

module.exports = ({
	getUser: (req, res) => {

	},

	getToken: (req, res) => {

	}
});