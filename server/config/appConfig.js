const bodyParser = require('body-parser'),
	express = require('express'),
	helmet = require('helmet'),
	apiRoutes = require('../routes/api');

module.exports = app => {
	/** security **/
	app.use(helmet());

	/** gnu **/
	app.use((req, res, next) => {
		res.set('X-Clacks-Overhead', 'GNU Terry Pratchet');
		next();
	});

	/** cors **/
	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-type, Accept'
		);
		res.header(
			'Access-Control-Allow-Methods',
			'GET, POST, DELETE, OPTIONS'
		);
		next();
	});
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

	/** body parser **/
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	return {
		/**
		 * Routes must include fields for path, router, and controller.
		 * Routers must take a controller as an argument.
		 **/
		loadRoutes: routes => {
			routes.forEach(route => {
				app.use(route.path, route.router(route.controller));
			});
		}
	}
}
