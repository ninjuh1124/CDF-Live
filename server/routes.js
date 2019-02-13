const express = require('express'),
	helpers = require('./helpers'),
	routes = express();

routes.get('/v1/history.json', (req, res) => {
	helpers.getHistory(req, (err, arr) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, arr);
	});
});

routes.get('/v1/parenthistory.json', (req, res) => {
	helpers.getParents(req, (err, arr) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, arr);
	});
});

routes.get('/v1/children.json', (req, res) => {
	helpers.getChildren(req, (err, arr) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, arr);
	});
});

routes.get('/v1/commenttree.json', (req, res) => {
	helpers.getTree(req, (err, arr) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, arr);
	});
});

routes.get('/v1/thread.json', (req, res) => {
	helpers.getLatestThread( (err, arr) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, arr);
	});
});

routes.get('/v1/comment', (req, res) => {
	helpers.getComment(req, (err, comment) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, comment);
	});
});

routes.get('/v1/about.md', (req, res) => {
	helpers.getAbout( (err, content) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, content);
	});
});

module.exports = routes;
