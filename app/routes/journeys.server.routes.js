'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var journeys = require('../../app/controllers/journeys');

	// Journeys Routes
	app.route('/journeys')
		.get(journeys.list)
		.post(users.requiresLogin, journeys.create);

	app.route('/journeys/:journeyId')
		.get(journeys.read)
		.put(users.requiresLogin, journeys.hasAuthorization, journeys.update)
		.delete(users.requiresLogin, journeys.hasAuthorization, journeys.delete);

	// Finish by binding the Journey middleware
	app.param('journeyId', journeys.journeyByID);
};