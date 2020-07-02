const app = require('./app');
const appConfig = require('./appConfig');

const dotenv = require('dotenv').config();

const apiPort = process.env.API_PORT ? process.env.API_PORT : 8090;

appConfig(app);

/** START SERVER **/
app.listen(apiPort);
console.log('############');
console.log(`Listening on Port ${apiPort}`);
