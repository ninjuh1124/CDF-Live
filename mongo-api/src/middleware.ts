import * as bodyParser from 'body-parser';

export const middleware = [
	bodyParser.urlencoded({ extended: true }),
	bodyParser.json()
];