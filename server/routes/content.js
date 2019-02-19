const express = require('express'),
	content = require('../controllers/content'),
	routes = express();

routes.get('/about.md'), content.about);
