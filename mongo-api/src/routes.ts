import { apiRouter } from './routes/api';
import { apiController } from './controllers/api';

export const routes = [
	{
		path: '/v1/',
		router: apiRouter,
		controller: apiController
	}
];