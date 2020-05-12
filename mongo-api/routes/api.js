const router = require('express').Router();

module.exports = controller => {
	// retrieve resource
	router.get('/history.json', controller.history);
	router.get('/comment.json', controller.getComment);
	router.get('/thread.json', controller.getThread);

	// create resource
	router.post('/comment', controller.insertComments);
	router.post('/thread', controller.insertThread);

	// delete resource
	router.delete('/comment', controller.deleteComment);
	//routes.delete('/thread', controller.deleteThread);

	// update resource
	router.put('/comment', controller.editComment);

	return router;
};
