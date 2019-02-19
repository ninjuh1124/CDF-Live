// maybe I should organize these better
const dotenv = require('dotenv'),
	express = require('express'),
	helmet = require('helmet'),
	app = express(),
	api = require('./routes/api'),
	content = require('./routes/content');

dotenv.load();
let apiPort = process.env.API_PORT ? process.env.API_PORT : 8080;
var server = app.listen(apiPort);

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
app.use('/v1/', api);
app.use('/content/', content);
