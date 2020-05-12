const express = require('express');

module.exports = controller => {
	const routes = express.Router();

	routes.get('/history.json', controller.history);
	routes.get('/comment.json', controller.comment);
	routes.post('/edit/:id', controller.editComment);
	routes.delete('/delete/:id', controller.deleteComment);

	return routes;
};
