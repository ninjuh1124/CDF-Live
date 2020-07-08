import { app } from './app';
import { appConfig } from './appConfig';
import { middleware } from './middleware';
import { routes } from './routes';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const apiPort = process.env.API_PORT ? process.env.API_PORT : 8090;

appConfig(app, { middleware, routes });

app.listen(apiPort);
console.log('#########');
console.log(`Listening on port ${apiPort}`);