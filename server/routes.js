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

routes.get('/v1/thread.json', (req, res) => {
	helpers.getLatestThread( (err, arr) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, arr);
	});
});

routes.get('/v1/comment', (req, res) => {
	helpers.getComment(req.query.id, (err, comment) => {
		if (err) helpers.sendFailure(res, 500, err);
		helpers.sendSuccess(res, comment);
	});
});

module.exports = routes;
