const config = require('./config');
const imageController = require('../controllers/imageController');
const notFoundController = require('../controllers/notFoundController');
const path = require('path');

module.exports = (app) => {
	// Routes
	app.get('/', async (req, res) => {
		if (config.env === 'production') {
			return res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
		} else {
			return res.json({ message: 'REST Service is running' });
		}
	});

	app.use('/api', imageController);

	// Catch-all route for client-side routing in production
	app.use('*', (req, res, next) => {
		if (config.env === 'production') {
			res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
		} else {
			notFoundController(req, res, next);
		}
	});
};
