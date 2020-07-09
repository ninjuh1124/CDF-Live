import * as express from 'express';
const router = express.Router();

export const apiRouter = (controller): express.Router => {
	router.get('token.json', controller.getToken);
	router.get('user.json', controller.getUser);

	return router;
}