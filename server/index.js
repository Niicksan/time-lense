require('dotenv').config()
const express = require('express');
const config = require('./config/config');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');


async function start() {
	const app = express();

	expressConfig(app);
	routesConfig(app);
	config.host = `http://${config.host}:${config.port}`;

	app.listen(config.port, console.log(`REST Service is listening on port ${config.port}! Now it\'s up to you! Open your browser on ${config.host}`));
}

start();