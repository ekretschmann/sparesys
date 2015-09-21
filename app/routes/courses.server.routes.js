'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var courses = require('../../app/controllers/courses');

	// Courses Routes
	app.route('/courses')
		.get(courses.list)
		.post(users.requiresLogin, courses.create);

    app.route('/courses/upload')
        .post(users.requiresLogin, courses.upload);

//
    app.route('/courses/cards/:cId')
        .get(courses.getCardsForCourse);


    app.route('/courses/copy/:cId2')
        .post(courses.copyCourse);

	//app.route('courses/cardDefaults/:courseId')
	//	.post(courses.cardDefaults);

	app.route('/courses/:courseId/defaults')
		.post(users.requiresLogin, courses.hasAuthorization, courses.updateDefaultSettings);


    app.route('/courses/:courseId')
		.get(courses.read)
		.put(users.requiresLogin, courses.update)
		.post(users.requiresLogin, courses.hasAuthorization, courses.update)
	    .delete(users.requiresLogin, courses.hasAuthorization, courses.delete);


	app.route('/courses/:cId3/removeDanglingPackSlaves')
		//.get(courses.read);
		.get(courses.removeDanglingPackSlaves);
		//.get(courses.removeDanglingPackSlaves, users.requiresLogin, courses.hasAuthorization);




	// Finish by binding the Course middleware
	app.param('courseId', courses.courseByID);
	app.param('cId', courses.getCardsForCourse);
	app.param('cId2', courses.copyCourse);
	app.param('cId3', courses.removeDanglingPackSlaves);
};
