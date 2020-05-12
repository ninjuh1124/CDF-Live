const express = require('express');

module.exports = (() => {
	const app = express();
	console.log('App created');

	/** access control **/
	app.options('/*', (req, res) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Methods', 
			'GET, POST, DELETE, OPTIONS'
		);
		res.header(
			'Access-Control-Allow-Headers', 
			'Content-Type, Authorization, Content-Length, X-Requested-With'
		);
		res.sendStatus(200);
	})

	app.loadMiddleware = middleware => {
		console.log('Loading middleware');
		middleware.forEach(m => app.use(m));
		console.log('Middleware loaded');
	};

	app.loadRoutes = routes => {
		console.log('Loading routes');
		routes.forEach(route => {
			app.use(route.path, route.router(route.controller));
			console.log(`----Loaded route: ${route.path}`);
		})
		console.log('All routes loaded');
	};

	return app;
})()
