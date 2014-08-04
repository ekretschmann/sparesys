'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schoolclass = mongoose.model('Schoolclass'),
    _ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function (err) {
    var message = '';

    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Schoolclass already exists';
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
 * Create a Schoolclass
 */
exports.create = function (req, res) {
    var schoolclass = new Schoolclass(req.body);
    schoolclass.user = req.user;

    schoolclass.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(schoolclass);
        }
    });
};

/**
 * Show the current Schoolclass
 */
exports.read = function (req, res) {
    res.jsonp(req.schoolclass);
};

/**
 * Update a Schoolclass
 */
exports.update = function (req, res) {


    var schoolclass = req.schoolclass;

    schoolclass = _.extend(schoolclass, req.body);

    schoolclass.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(schoolclass);
        }
    });
};

/**
 * Delete an Schoolclass
 */
exports.delete = function (req, res) {
    var schoolclass = req.schoolclass;

    schoolclass.remove(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(schoolclass);
        }
    });
};

/**
 * List of Schoolclasses
 */
exports.list = function (req, res) {
    Schoolclass.find().sort('-created').populate('user', 'displayName').exec(function (err, schoolclasses) {

        if (req.query.courses) {

            Schoolclass.find({'courses': req.query.courses}).exec(function (err, courses) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(courses);
                }
            });
        } else {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(schoolclasses);
            }
        }
    });

};

/**
 * Schoolclass middleware
 */
exports.schoolclassByID = function (req, res, next, id) {
    Schoolclass.findById(id).populate('user', 'displayName').exec(function (err, schoolclass) {
        if (err) return next(err);
        if (!schoolclass) return next(new Error('Failed to load Schoolclass ' + id));
        req.schoolclass = schoolclass;
        next();
    });
};

/**
 * Schoolclass authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.schoolclass.user.id !== req.user.id) {
        return res.send(403, 'User is not authorized');
    }
    next();
};