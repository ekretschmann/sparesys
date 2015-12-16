'use strict';

module.exports = function(app) {
	// Root routing
	var globals = require('../../app/controllers/globals');

	app.route('/globals')
		.get(globals.list)
		.post(globals.requiresLogin, globals.create);

};
