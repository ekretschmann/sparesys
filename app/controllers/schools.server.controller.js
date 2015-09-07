'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    School = mongoose.model('School'),
    User = mongoose.model('User'),
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
exports.create = function (req, res) {
    var school = new School(req.body);
    school.user = req.user;


    school.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            req.user.administersSchools.push(school._id);
            req.user.save(function () {
                res.jsonp(school);
            });

        }
    });
};

/**
 * Show the current School
 */
exports.read = function (req, res) {
    res.jsonp(req.school);
};

/**
 * Update a School
 */
exports.update = function (req, res) {


    var school = req.school;
    var originalUserId;

    if (school.user) {
        originalUserId = school.user._id;
    }


    var originalTeachers = [];
    for (var i = 0; i < school.teachers.length; i++) {
        originalTeachers.push(school.teachers[i].id);
    }

    school = _.extend(school, req.body);

    var currentTeachers = [];
    for (i = 0; i < school.teachers.length; i++) {
        if(school.teachers[i]._id) {
            currentTeachers.push('' + school.teachers[i]._id);
        } else {
            currentTeachers.push('' + school.teachers[i]);
        }
    }

    var newTeachers = [];
    for (i = 0; i < currentTeachers.length; i++) {
        if (originalTeachers.indexOf(currentTeachers[i]) === -1) {
            newTeachers.push(currentTeachers[i]);
        }
    }

    var removedTeachers = [];
    for (i = 0; i < originalTeachers.length; i++) {
        if (currentTeachers.indexOf(originalTeachers[i]) === -1) {
            removedTeachers.push(originalTeachers[i]);
        }
    }


    var addSchoolToTeacher = function (userId, schoolId) {
        User.findOne({_id: userId}, 'teacherInSchools').exec(function (err, newUser) {

            if (newUser.teacherInSchools.indexOf(schoolId) === -1) {
                newUser.teacherInSchools.push(schoolId);
            }
            newUser.save();
        });
    };

    var removeSchoolFromTeacher = function (userId, schoolId) {
        User.findOne({_id: userId}, 'teacherInSchools').exec(function (err, newUser) {

            newUser.teacherInSchools.splice(newUser.teacherInSchools.indexOf(schoolId));
            newUser.save();
        });
    };


    for (i = 0; i < newTeachers.length; i++) {
        addSchoolToTeacher(newTeachers[i], school._id);
    }

    for (i = 0; i < removedTeachers.length; i++) {
        removeSchoolFromTeacher(removedTeachers[i], school._id);
    }

    //if (originalUserId && school.user._id.toString() !== originalUserId.toString()) {
    //
    //   User.findOne({_id: school.user._id}, 'administersSchools').exec(function (err, newUser) {
    //
    //       if (newUser.administersSchools.indexOf(school._id) === -1) {
    //           newUser.administersSchools.push(school._id);
    //       }
    //       newUser.save();
    //   });
    //
    //   User.findOne({_id: originalUserId}, 'administersSchools').exec(function (err, originalUser) {
    //       for (var j in originalUser.administersSchools) {
    //           if (originalUser.administersSchools[j].toString() === school._id.toString()) {
    //               originalUser.administersSchools.splice(j, 1);
    //           }
    //       }
    //       originalUser.save();
    //   });
    //}
    //
    school.save(function (err) {


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
exports.delete = function (req, res) {
    var school = req.school;

    if (school.user) {
        var userId = school.user._id;
    }

    school.remove(function (err) {


        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {

            if (userId) {

                User.findOne({_id: userId}, 'administersSchools').exec(function (err, originalUser) {

                    for (var j in originalUser.administersSchools) {
                        if (originalUser.administersSchools[j].toString() === school._id.toString()) {
                            originalUser.administersSchools.splice(j, 1);
                        }
                    }
                    originalUser.save();
                });
            }


            res.jsonp(school);
        }
    });
};

/**
 * List of Schools
 */
exports.list = function (req, res) {


    if (req.query && req.query.text) {
        var search = req.query.text.split(' ');

        if (search.length === 1) {
            School.find({$or: [{'name': {$regex: search[0]}}, {'city': {$regex: '^' + search[0]}}, {'country': {$regex: '^' + search[0]}}]}).limit(25).exec(function (err, schools) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    if (schools.length === 0) {
                        School.findById(search[0]).populate('user', 'displayName').populate('user', '-salt -password -__v -provider').populate('teachers', 'displayName').populate('students', 'displayName').populate('schoolclasses').exec(function (err, school) {

                            if (school) {
                                res.jsonp([school]);
                            } else {
                                res.jsonp([]);
                            }

                        });

                    } else {
                        res.jsonp(schools);
                    }
                }
            });
        } else if (search.length === 2) {
            School.find({$and: [{'name': {$regex: search[0]}}, {'city': {$regex: '^' + search[1]}}]}).limit(25).exec(function (err, schools) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(schools);
                }
            });
        } else {
            res.jsonp([]);
        }
    } else {


        if (req.query.student) {
            School.find({'students': req.query.student}).populate('user').populate('schoolclasses').exec(function (err, schools) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(schools);
                }
            });
        } else if (req.query.teachers) {
            School.find({'teachers': req.query.teachers}).populate('user').populate('schoolclasses').exec(function (err, schools) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(schools);
                }
            });
        } else if (req.query.userId) {


            School.find({'user': req.query.userId}).populate('user').populate('schoolclasses').exec(function (err, courses) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(courses);
                }
            });
        } else {
            School.find().sort('-created').populate('user').populate('schoolclasses').exec(function (err, schools) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(schools);
                }
            });
        }
    }
};

/**
 /**
 * School middleware
 */
exports.schoolByID = function (req, res, next, id) {


    School.findById(id).populate('user', 'displayName').populate('user', '-salt -password -__v -provider').populate('teachers', 'displayName').populate('students', 'displayName').populate('schoolclasses').exec(function (err, school) {


        if (err) return next(err);
        if (!school) return next(new Error('Failed to load School ' + id));
        req.school = school;
        next();
    });
};

/**
 * School authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {

    if (req.user.roles.indexOf('admin') > -1) {
        next();
    } else if (req.school.user && (req.school.user.id !== req.user.id)) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }
};

