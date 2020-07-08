import * as express from 'express';

interface Configuration {
	middleware?: ((req: express.Request, res: express.Response, next) => void)[],
	routes: Array<any>
}

export const appConfig = (app: express.Express, options: Configuration) => {
	if (options.middleware !== null) {
		console.log('Loading middleware');
		options.middleware.forEach(m => app.use(m));
		console.log('Middleware loaded');
	}

	if (options.routes === null) {
		throw new Error('No routes provided');
	}

	console.log('Loading routes');
	options.routes.forEach(route => {
		app.use(route.path, route.router(route.controller));
		console.log(`----${route.path}`);
	});
	console.log('All routes loaded');
};