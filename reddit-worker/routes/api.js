const router = require('express').Router;

module.exports = controller => {
	router.get('token.json', controller.getToken);
	router.get('user.json', controller.getUser);

	return router;
}