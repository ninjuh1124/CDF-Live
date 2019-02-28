const express = require('express'),
	routes = express();

routes.use('/', express.static('content'));

module.exports = routes;
