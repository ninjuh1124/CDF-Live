const app = require('./app');

const express = require('express'),
	helmet = require('helmet'),
	bodyParser = require('body-parser');

const dotenv = require('dotenv').config();

const apiPort = process.env.API_PORT ? process.env.API_PORT : 8080;

/** LOAD MIDDLEWARE **/
app.loadMiddleware([
	/** safety **/
	helmet(),

	/** gnu **/
	(req, res, next) => {
		res.setHeader('X-Clacks-Overhead', 'GNU TERRY PRATCHET');
		next();
	},

	/** body parser **/
	bodyParser.urlencoded({ extended: true }),
	bodyParser.json(),

	/** access controll **/
	(req, res, next) => {
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
	}
]);

/** LOAD ROUTES **/
app.loadRoutes([
	{	/** CRUD api for Mongo repo **/
		path: '/v1/',
		router: require('./routes/api'),
		controller: require('./controllers/api')
	},
	{	/** static content in 'content' folder **/
		path: '/content/',
		router: controller => express().use('/', controller),
		controller: express.static('content')
	}
]);

/** START SERVER **/
app.listen(apiPort);
console.log('###########');
console.log(`Listening on Port ${apiPort}`);
