'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	School = mongoose.model('School'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'School already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a School
 */
exports.create = function(req, res) {
	var school = new School(req.body);
	school.user = req.user;

	school.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(school);
		}
	});
};

/**
 * Show the current School
 */
exports.read = function(req, res) {
	res.jsonp(req.school);
};

/**
 * Update a School
 */
exports.update = function(req, res) {
	var school = req.school ;



	school = _.extend(school , req.body);

	school.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(school);
		}
	});
};

/**
 * Delete an School
 */
exports.delete = function(req, res) {
	var school = req.school ;

	school.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(school);
		}
	});
};

/**
 * List of Schools
 */
exports.list = function(req, res) { School.find().sort('-created').populate('user', 'displayName').exec(function(err, schools) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(schools);
		}
	});
};

/**
 * School middleware
 */
exports.schoolByID = function(req, res, next, id) { School.findById(id).populate('user', 'displayName').exec(function(err, school) {
		if (err) return next(err);
		if (! school) return next(new Error('Failed to load School ' + id));
		req.school = school ;
		next();
	});
};

/**
 * School authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.school.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};