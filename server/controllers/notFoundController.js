const notFoundController = require('express').Router();

notFoundController.get('/', (req, res) => {
	return res.send('<h1>404 Controller Not Found!</h1>');
});

module.exports = notFoundController;
