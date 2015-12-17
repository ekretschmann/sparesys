'use strict';

module.exports = function(app) {
	// Root routing
	var users = require('../../app/controllers/users.server.controller');
	var globals = require('../../app/controllers/globals');

	app.route('/globals')
		.get(globals.list)
		.post(globals.requiresLogin, globals.create);

	app.route('/globals/:globalsId')
		.get(globals.read)
		.put(users.requiresLogin, globals.hasAuthorization, globals.update)
		.delete(users.requiresLogin, globals.hasAuthorization, globals.delete);


	// Finish by binding the Reward middleware
	app.param('globalsId', globals.globalByID);

};
