'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Journey = mongoose.model('Journey'),
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
				message = 'Journey already exists';
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
 * Create a Journey
 */
exports.create = function(req, res) {
	var journey = new Journey(req.body);
	journey.user = req.user;

	journey.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(journey);
		}
	});
};

/**
 * Show the current Journey
 */
exports.read = function(req, res) {
	res.jsonp(req.journey);
};

/**
 * Update a Journey
 */
exports.update = function(req, res) {
	var journey = req.journey ;

	journey = _.extend(journey , req.body);

	journey.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(journey);
		}
	});
};

/**
 * Delete an Journey
 */
exports.delete = function(req, res) {
	var journey = req.journey ;

	journey.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(journey);
		}
	});
};

/**
 * List of Journeys
 */
exports.list = function(req, res) {


    if (req.query.userId) {

        Journey.find({'user': req.query.userId}).exec(function (err, journeys) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(journeys);
            }
        });
    } else {
        Journey.find().sort('-created').populate('user', 'displayName').exec(function (err, journeys) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(journeys);
            }
        });
    }
};

/**
 * Journey middleware
 */
exports.journeyByID = function(req, res, next, id) { Journey.findById(id).populate('user', 'displayName').exec(function(err, journey) {
		if (err) return next(err);
		if (! journey) return next(new Error('Failed to load Journey ' + id));
		req.journey = journey ;
		next();
	});
};

/**
 * Journey authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.journey.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};