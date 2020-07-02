const bodyParser = require('body-parser');

module.exports = app => {
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

}