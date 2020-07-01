const app = require('./app');

const express = require('express'),
	bodyParser = require('body-parser');

const dotenv = require('dotenv').config();

const apiPort = process.env.API_PORT ? process.env.API_PORT : 8090;

/** LOAD MIDDLEWARE **/
app.loadMiddleware([
	bodyParser.urlencoded({ extended: true }),
	bodyParser.json()
]);

/** LOAD ROUTES **/
app.loadRoutes([{
	path: '/v1/',
	router: require('./routes/api'),
	controller: require('./controllers/api')
}]);

/** START SERVER **/
app.listen(apiPort);
console.log('############');
console.log(`Listening on Port ${apiPort}`);
