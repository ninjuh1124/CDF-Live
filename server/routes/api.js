const express = require('express'),
	api = require('../controllers/api'),
	routes = express();

routes.get('/history.json', api.history);
routes.get('/commenttree.json', api.commenttree);
routes.get('/thread.json', api.thread);
routes.get('/comment.json', api.comment);
routes.get('/token.json', api.token);

module.exports = routes;
