'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Course = mongoose.model('Course'),
    Pack = mongoose.model('Pack'),
    Card = mongoose.model('Card'),
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
                message = 'Course already exists';
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
 * Create a Course
 */
exports.create = function (req, res) {
    var course = new Course(req.body);
    course.user = req.user;

    course.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(course);
        }
    });
};

/**
 * Show the current Course
 */
exports.read = function (req, res) {
    res.jsonp(req.course);
};

/**
 * Update a Course
 */
exports.update = function (req, res) {
    var course = req.course;

    course = _.extend(course, req.body);

    course.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(course);
        }
    });
};

/**
 * Delete an Course
 */
exports.delete = function (req, res) {
    var course = req.course;

    course.remove(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(course);
        }
    });
};

/**
 * List of Courses
 */
exports.list = function (req, res) {

    if (req.query.userId) {

        Course.find({'user': req.query.userId}).exec(function (err, courses) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(courses);
            }
        });
    } else if (req.query._id) {

        Course.find({'_id': req.query._id}).exec(function (err, courses) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(courses);
            }
        });
    } else {
        Course.find().sort('-created').populate('user', 'displayName').exec(function (err, courses) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(courses);
            }
        });
    }
};

/**
 * Course middleware
 */
exports.courseByID = function (req, res, next, id) {

    Course.findById(id).populate('user', 'displayName').exec(function (err, course) {
        if (err) return next(err);
        if (!course) return next(new Error('Failed to load Course ' + id));
        req.course = course;
        next();
    });
};

exports.courseByUser = function (req, res, next, id) {

    Course.find()
        .where('user').equals(id)
        .exec(function (err, courses) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(courses);
            }
        });
};

/**
 * Course authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.roles.indexOf('admin') > -1) {
        next();
    } else if (req.course.user && (req.course.user.id !== req.user.id)) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }
};

exports.getCards = function(req, res, next, id) {
    var result = [];
    Course.find({'_id': id}).exec(function (err, courses) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            courses[0].packs.forEach(function(packId) {
                Pack.find({'_id': packId}).exec(function (err, packs) {
                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    } else {
                        packs.forEach(function(pack) {
                            pack.cards.forEach(function(cardId){
                                Card.find({'_id': cardId}).exec(function (err, cards) {
                                    if (err) {
                                        return res.send(400, {
                                            message: getErrorMessage(err)
                                        });
                                    } else {
                                        result = result.concat(cards);

                                    }
                                });
                            });
                        });

                    }
                });
            });
//            console.log(result);
            res.jsonp(result);
        }
    });
};


