'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var courses = require('../../app/controllers/courses');

	// Courses Routes
	app.route('/courses')
		.get(courses.list)
		.post(users.requiresLogin, courses.create);

//
    app.route('/courses/cards/:cId')
        .get(courses.getCardsForCourse);


    app.route('/courses/copy/:cId2')
        .get(courses.copyCourse);


    app.route('/courses/:courseId')
		.get(courses.read)
		.post(users.requiresLogin, courses.hasAuthorization, courses.update)
	    .delete(users.requiresLogin, courses.hasAuthorization, courses.delete);

	// Finish by binding the Course middleware
	app.param('courseId', courses.courseByID);
	app.param('cId', courses.getCardsForCourse);
	app.param('cId2', courses.copyCourse);
};