const dotenv = require('dotenv'),
	express = require('express'),
	dbService = require('./config/dbConnection'),
	app = express(),
	config = require('./config/appConfig')(app);

dotenv.load();
let apiPort = process.env.API_PORT ? process.env.API_PORT : 8080;

dbService.connect()
	.then(pool => {
		config.loadRoutes([
			{	/** CRUD api for Mongo repo **/
				path: '/v1/',
				router: require('./routes/api'),
				controller: require('./controllers/api')(pool)
			},
			{	/** static content in 'content' folder **/
				path: '/content/',
				router: controller => express().use('/', controller),
				controller: express.static('content')
			}
		]);

		app.listen(apiPort);
	})
	.catch(err => {
		console.log(err);
	});
