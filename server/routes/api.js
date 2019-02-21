const express = require('express'),
	api = require('../controllers/api'),
	routes = express();

routes.get('/history.json', api.history);
routes.get('/parenthistory.json', api.parenthistory);
routes.get('/children.json', api.children);
routes.get('/commenttree.json', api.commenttree);
routes.get('/thread.json', api.thread);
routes.get('/comment.json', api.comment);

module.exports = routes;
