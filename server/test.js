// maybe I should organize these better
const dotenv = require('dotenv'),
	express = require('express'),
	helmet = require('helmet'),
	app = express();
	fs = require('fs'),
	MongoClient = require('mongodb').MongoClient,
	routes = require('./routes'),
	helpers = require('./helpers.js');

let apiPort = process.env.API_PORT ? process.env.API_PORT : 8080;
var server = app.listen(apiPort);

/**
 * BACKEND STUFF
**/

dotenv.load();

// get thread history
var threads = [];
helpers.loadThreadList( (err, arr) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	threads = arr.map(d => d._id);
});

app.use(helmet());
app.use((req, res, next) => {
	res.set('X-Clacks-Overhead', 'GNU Terry Pratchet');
	next();
});
app.use( (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept');
	next();
});
app.use('/', routes);
