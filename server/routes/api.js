const express = require('express');

module.exports = controller => {
	const routes = express();

	routes.get('/history.json', controller.history);
	routes.get('/thread.json', controller.thread);
	routes.get('/comment.json', controller.comment);
	routes.get('/token.json', controller.token);
	routes.post('/edit', controller.editComment);
	routes.post('/delete', controller.deleteComment);

	return routes;
}
