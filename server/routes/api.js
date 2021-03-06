const express = require('express');

module.exports = (app, db) => {
	const api = require('../controllers/api')(db);
	const routes = express();
	routes.get('/history.json', api.history);
	routes.get('/thread.json', api.thread);
	routes.get('/comment.json', api.comment);
	routes.get('/token.json', api.token);
	routes.post('/edit', api.editComment);
	routes.post('/delete', api.deleteComment);

	app.use('/v1/', routes);
}
