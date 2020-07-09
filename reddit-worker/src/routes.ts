import * as express from 'express';
import { apiRouter } from './routes/api';
import { apiController } from './controllers/api';

export const routes: Array<{ path: string, router: (controller: object) => express.Router, controller: object }> = [
	{
		path: '/v1/',
		router: apiRouter,
		controller: apiController
	}
];