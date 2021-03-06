'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var schoolclasses = require('../../app/controllers/schoolclasses');

	// Schoolclasses Routes
	app.route('/schoolclasses')
		.get(schoolclasses.list)
		.post(users.requiresLogin, schoolclasses.create);

	app.route('/schoolclasses/:schoolclassId/addTeacher/:userId')
		.post(users.requiresLogin, schoolclasses.hasAuthorization, schoolclasses.addTeacher);

	app.route('/schoolclasses/:schoolclassId')
		.get(schoolclasses.read)
		.put(users.requiresLogin, schoolclasses.update)
		.delete(users.requiresLogin, schoolclasses.hasAuthorization, schoolclasses.delete);

	// Finish by binding the Schoolclass middleware
	app.param('schoolclassId', schoolclasses.schoolclassByID);
};