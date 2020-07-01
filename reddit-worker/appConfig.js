const helmet = require('helmet'),
	bodyParser = require('body-parser');

module.exports = (app) => {
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

		/** access control **/
		(req, res, next) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header(
				'Access-Control-Allow-Headers',
				'Origin, X-Requested-With, Content-type, Accept'
			);
			res.header(
				'Access-Control-Allow-Methods',
				'GET'
			);
			next();
		}
	]);

	/** LOAD ROUTES **/
	app.loadRoutes([
		{
			path: '/v1/',
			controller: require('./controllers/api'),
			router: require('./routes/api')
		}
	]);
}