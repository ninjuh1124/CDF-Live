// maybe I should organize these better
const dotenv = require('dotenv'),
	express = require('express'),
	bodyParser = require('body-parser'),
	helmet = require('helmet'),
	MongoClient = require('mongodb').MongoClient,
	app = express(),
	api = require('./routes/api'),
	content = require('./routes/content');

dotenv.load();
let apiPort = process.env.API_PORT ? process.env.API_PORT : 8080;
MongoClient.connect(
	(process.env.MONGO_URI ? 
	process.env.MONGO_URI : 
	'mongodb://localhost/fridaydotmoe')
).then(pool => {
	app.use(helmet());
	app.use( (req, res, next) => {
		res.set('X-Clacks-Overhead', 'GNU Terry Pratchet')
		next();
	});
	app.use( (req, res, next) => {
		// CORS stuff
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
		// CORS stuff
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
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());
	require('./routes/api')(app, pool);
	require('./routes/content')(app);
	app.listen(apiPort);
});
