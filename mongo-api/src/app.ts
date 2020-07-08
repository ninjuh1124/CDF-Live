import * as express from 'express';

const app = express();

app.options('/*', (req: express.Request, res: express.Response) => {
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

export { app };