'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schoolclass = mongoose.model('Schoolclass'),
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

    School.findById(schoolclass.school).exec(function (err, school) {


        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            schoolclass.save(function (err) {

                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {

                    school.schoolclasses.push(schoolclass._id);
                    school.save(function(err, s) {
                        console.log(s);
                        res.jsonp(schoolclass);
                    });


                }
            });
        }

    });


};

/**
 * Show the current Schoolclass
 */
exports.read = function (req, res) {
    res.jsonp(req.schoolclass);
};


exports.addTeacher = function (req, res) {
    //console.log(req.schoolclass);
    //console.log(req.params);
    //console.log(req.params.userId);


    var schoolclass = req.schoolclass;
    console.log(schoolclass);
    schoolclass.teachers.push(req.params.userId);

    console.log(schoolclass);
    schoolclass.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            console.log(schoolclass);
            res.jsonp(schoolclass);
        }
    });

    //Schoolclass.findById(id).populate('user', 'displayName').populate('teachers', 'displayName').populate('students', 'displayName').exec(function (err, schoolclass) {
    //    if (err) return next(err);
    //    if (!schoolclass) return next(new Error('Failed to load Schoolclass ' + id));
    //    req.schoolclass = schoolclass;
    //    next();
    //});


};

/**
 * Update a Schoolclass
 */
exports.update = function (req, res) {


    var schoolclass = req.schoolclass;

    schoolclass = _.extend(schoolclass, req.body);


    console.log(schoolclass);


    //$scope.school.schoolclasses.push(schoolClass);
    //$scope.school.$save(function(){
    //
    //});

    //schoolclass.save(function(err) {
    //    if (err) {
    //        return res.send(400, {
    //            message: getErrorMessage(err)
    //        });
    //    } else {
    //        res.jsonp(message);
    //    }
    //});


    //var schoolclass = req.schoolclass;
    ////var originalTeachers = schoolclass.teachers;
    ////var originalStudents = schoolclass.students;
    ////
    ////schoolclass = _.extend(schoolclass, req.body);
    //
    ////schoolclass.students = req.body.students;
    ////schoolclass.teachers = req.body.teachers;
    //
    //
    //schoolclass = _.extend(schoolclass, req.body);
    //console.log(schoolclass.teachers);
    //console.log(req.body.teachers);


    //console.log(schoolclass.teachers);


    //console.log(schoolclass);


    //schoolclass.save(function (err) {
    //    if (err) {
    //        return res.send(400, {
    //            message: getErrorMessage(err)
    //        });
    //    } else {
    //        var currentTeachers = schoolclass.teachers;
    //        var currentStudents = schoolclass.students;
    //
    //        originalTeachers.forEach(function(originalTeacherId) {
    //            if (currentTeachers.indexOf(originalTeacherId) === -1) {
    //                User.findOne({_id: originalTeacherId}, 'teachesClasses').exec(function (err, originalTeacher) {
    //
    //                    for (var j in originalTeacher.teachesClasses) {
    //                        if (originalTeacher.teachesClasses[j].toString() === schoolclass._id.toString()) {
    //                            originalTeacher.teachesClasses.splice(j, 1);
    //                        }
    //                    }
    //                    originalTeacher.save();
    //                });
    //            }
    //        });
    //
    //
    //
    //        currentTeachers.forEach(function(currentTeacherId) {
    //            User.findOne({_id: currentTeacherId}, 'teachesClasses').exec(function (err, currentTeacher) {
    //
    //                if (currentTeacher.teachesClasses.indexOf(schoolclass._id) === -1) {
    //                    currentTeacher.teachesClasses.push(schoolclass._id);
    //                }
    //                currentTeacher.save();
    //            });
    //        });
    //
    //
    //        originalStudents.forEach(function(originalStudentId) {
    //            if (currentStudents.indexOf(originalStudentId) === -1) {
    //                User.findOne({_id: originalStudentId}, 'studentInClasses').exec(function (err, originalStudent) {
    //
    //                    for (var j in originalStudent.studentInClasses) {
    //                        if (originalStudent.studentInClasses[j].toString() === schoolclass._id.toString()) {
    //                            originalStudent.studentInClasses.splice(j, 1);
    //                        }
    //                    }
    //                    originalStudent.save();
    //                });
    //            }
    //        });
    //
    //        currentStudents.forEach(function(currentStudentId) {
    //            User.findOne({_id: currentStudentId}, 'studentInClasses').exec(function (err, currentStudent) {
    //
    //                if (currentStudent.studentInClasses.indexOf(schoolclass._id) === -1) {
    //                    currentStudent.studentInClasses.push(schoolclass._id);
    //                }
    //                currentStudent.save();
    //            });
    //        });
    //
    //
    //        res.jsonp(schoolclass);
    //    }
    //});
};

/**
 * Delete an Schoolclass
 */
exports.delete = function (req, res) {
    var schoolclass = req.schoolclass;
    var school;
    School.find({'_id': schoolclass.school}).exec(function (err, schools) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            if (school) {
                school = schools[0];
                for (var i = 0; i < school.schoolclasses.length; i++) {
                    if (schoolclass._id.toString() === school.schoolclasses[i].toString()) {
                        school.schoolclasses.splice(i, 1);
                    }
                }

                school.save(function (err) {
                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    }
                });
            }
        }
    });

    schoolclass.remove(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp({school: school, schoolclass: schoolclass});
        }
    });

    //@TODO: Remove references from teachers and students
};

/**
 * List of Schoolclasses
 */
exports.list = function (req, res) {


    if (req.query.teacher) {

        Schoolclass.find({'teachers': req.query.teacher}).populate('students', 'displayName').populate('courses').exec(function (err, schoolclasses) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(schoolclasses);
            }
        });
    } else if (req.query.userId) {

        Schoolclass.find({'user': req.query.userId}).exec(function (err, schoolclasses) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(schoolclasses);
            }
        });
    } else if (req.query.courses) {

        Schoolclass.find({'courses': req.query.courses}).exec(function (err, schoolclasses) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(schoolclasses);
            }
        });
    } else {
        Schoolclass.find().exec(function (err, schoolclasses) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(schoolclasses);
            }
        });
    }

};

/**
 * Schoolclass middleware
 */
exports.schoolclassByID = function (req, res, next, id) {
    Schoolclass.findById(id).populate('user', 'displayName').populate('teachers', 'displayName').populate('students', 'displayName').exec(function (err, schoolclass) {
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
    if (req.user.roles.indexOf('admin') > -1) {
        next();
    } else if (req.schoolclass.user && (req.schoolclass.user.id !== req.user.id)) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }
};
