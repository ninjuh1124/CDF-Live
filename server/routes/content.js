const express = require('express');

module.exports = (app) => {
	app.use('/content/', express.static('content'));
};
