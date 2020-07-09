import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet'

export const middleware: Array<(req: express.Request, res: express.Response, next) => void> = [
	helmet(),
	(req, res, next) => {
		res.setHeader('X-Clacks-Overhead', 'GNU TERRY PRATCHET');
		next();
	},
	bodyParser.urlencoded({ extended: true }),
	bodyParser.json()
];