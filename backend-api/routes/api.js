const router = require('express').Router();

module.exports = controller => {
	router.get('/history.json', controller.history);
	router.get('/thread.json', controller.thread);
	router.get('/comment.json', controller.comment);
	router.get('/token.json', controller.token);

	router.post('/edit', controller.editComment);
	router.post('/delete', controller.deleteComment);

	return router;
}
