'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    School = mongoose.model('School'),
    User = mongoose.model('User'),
    _ = require('lodash'),
    q = require('q');

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


var updateTeachers = function (school, originalTeachers) {

    var deferred = q.defer();

    var currentTeachers = [];
    for (var i = 0; i < school.teachers.length; i++) {
        if (school.teachers[i]._id) {
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

            if (newUser) {
                if (newUser.teacherInSchools.indexOf(schoolId) === -1) {
                    newUser.teacherInSchools.push(schoolId);
                }

                newUser.save(function () {
                    deferred.newTeachers--;
                    if (deferred.newTeachers === 0 && deferred.removedTeachers === 0) {
                        console.log('resolved 1');
                        console.log('saved teacher:' + newUser.teacherInSchools);
                        deferred.resolve(true);
                    }
                });
            }
        });
    };

    var removeSchoolFromTeacher = function (userId, schoolId) {
        User.findOne({_id: userId}, 'teacherInSchools').exec(function (err, newUser) {

            if (newUser) {
                newUser.teacherInSchools.splice(newUser.teacherInSchools.indexOf(schoolId));
                newUser.save(function () {
                    deferred.removedTeachers--;
                    if (deferred.newTeachers === 0 && deferred.removedTeachers === 0) {
                        console.log('resolved 2');
                        deferred.resolve(true);
                    }
                });
            }
        });
    };

    deferred.newTeachers = newTeachers.length;
    deferred.removedTeachers = removedTeachers.length;
    if (deferred.newTeachers === 0 && deferred.removedTeachers === 0) {
        deferred.resolve(true);
    }


    for (i = 0; i < newTeachers.length; i++) {
        addSchoolToTeacher(newTeachers[i], school._id);
    }

    for (i = 0; i < removedTeachers.length; i++) {
        removeSchoolFromTeacher(removedTeachers[i], school._id);
    }

    return deferred.promise;

};

var updateStudents = function (school, originalStudents) {

    var deferred = q.defer();

    var currentStudents = [];
    for (var i = 0; i < school.students.length; i++) {
        if (school.students[i]._id) {
            currentStudents.push('' + school.students[i]._id);
        } else {
            currentStudents.push('' + school.students[i]);
        }
    }

    var newStudents = [];
    for (i = 0; i < currentStudents.length; i++) {
        if (originalStudents.indexOf(currentStudents[i]) === -1) {
            newStudents.push(currentStudents[i]);
        }
    }

    var removedStudents = [];
    for (i = 0; i < originalStudents.length; i++) {
        if (currentStudents.indexOf(originalStudents[i]) === -1) {
            removedStudents.push(originalStudents[i]);
        }
    }

    var addSchoolToStudent = function (userId, schoolId) {
        User.findOne({_id: userId}, 'studentInSchools').exec(function (err, newUser) {

            if (newUser) {
                if (newUser.studentInSchools.indexOf(schoolId) === -1) {
                    newUser.studentInSchools.push(schoolId);
                }

                newUser.save(function () {
                    deferred.newStudents--;
                    if (deferred.newStudents === 0 && deferred.removedStudents === 0) {
                        console.log('resolved 1');
                        console.log('saved student:' + newUser.studentInSchools);
                        deferred.resolve(true);
                    }
                });
            }
        });
    };

    var removeSchoolFromStudent = function (userId, schoolId) {
        User.findOne({_id: userId}, 'studentInSchools').exec(function (err, newUser) {

            if (newUser) {
                newUser.studentInSchools.splice(newUser.studentInSchools.indexOf(schoolId));
                newUser.save(function () {
                    deferred.removedStudents--;
                    if (deferred.newStudents === 0 && deferred.removedStudents === 0) {
                        console.log('resolved 2');
                        deferred.resolve(true);
                    }
                });
            }
        });
    };

    deferred.newStudents = newStudents.length;
    deferred.removedStudents = removedStudents.length;
    if (deferred.newStudents === 0 && deferred.removedStudents === 0) {
        deferred.resolve(true);
    }


    for (i = 0; i < newStudents.length; i++) {
        addSchoolToStudent(newStudents[i], school._id);
    }

    for (i = 0; i < removedStudents.length; i++) {
        removeSchoolFromStudent(removedStudents[i], school._id);
    }

    return deferred.promise;

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

    var originalStudents = [];
    for (i = 0; i < school.students.length; i++) {
        originalStudents.push(school.students[i].id);
    }


    school = _.extend(school, req.body);


    updateTeachers(school, originalTeachers).then(
        updateStudents(school, originalStudents).then(
            function () {

                var uniqueTeachers = [];
                for (i = 0; i < school.teachers.length; i++) {
                    var t = school.teachers[i];
                    if (t._id) {
                        t = t._id + '';
                    } else {
                        t = t + '';
                    }
                    if (uniqueTeachers.indexOf(t) === -1) {
                        uniqueTeachers.push(t);
                    }
                }

                var uniqueStudents = [];
                for (i = 0; i < school.students.length; i++) {
                    var s = school.students[i];
                    if (s._id) {
                        s = s._id + '';
                    } else {
                        s = s + '';
                    }
                    if (uniqueStudents.indexOf(s) === -1) {
                        uniqueStudents.push(s);
                    }
                }

                school.teachers = uniqueTeachers;
                school.students = uniqueStudents;


                school.save(function (err) {


                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    } else {
                        console.log('returning school');
                        res.jsonp(school);
                    }
                });
            })
    );
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


    //School.findById(id).populate('user', 'displayName').populate('user', '-salt -password -__v -provider').populate('students', 'displayName').populate('schoolclasses').exec(function (err, school) {
    //
    //
    //    if (err) return next(err);
    //    if (!school) return next(new Error('Failed to load School ' + id));
    //    req.school = school;
    //    next();
    //});
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

