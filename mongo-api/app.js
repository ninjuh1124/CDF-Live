const express = require('express'),
	bodyParser = require('body-parser');

module.exports = (() => {
	const app = express();

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
	});

	app.loadMiddleware = middleware => {
		console.log('Loading middleware');
		middleware.forEach(m => app.use(m));
		console.log('All middleware loaded');
	};

	app.loadRoutes = routes => {
		console.log('Loading routes');
		routes.forEach(route => {
			app.use(route.path, route.router(route.controller));
			console.log(`----${route.path} loaded`);
		})
		console.log('All routes loaded');
	}

	return app;
})()
