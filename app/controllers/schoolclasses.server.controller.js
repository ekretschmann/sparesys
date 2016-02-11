'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schoolclass = mongoose.model('Schoolclass'),
    Course = mongoose.model('Course'),
    School = mongoose.model('School'),
    User = mongoose.model('User'),
    courses = require('../../app/controllers/courses'),
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

                    school.save(function (err, s) {
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
    schoolclass.teachers.push(req.params.userId);

    schoolclass.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
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

var updateUsers = function (originalTeachers, originalStudents, currentTeacherIds, currentStudentIds, schoolclass) {

    var deferred = q.defer();
    var updates = 0;
    originalTeachers.forEach(function (originalTeacher) {
        if (currentTeacherIds.indexOf(originalTeacher._id + '') === -1) {
            updates++;
        }
    });


    currentTeacherIds.forEach(function (currentTeacherId) {
        updates++;
    });


    originalStudents.forEach(function (originalStudent) {
        if (currentStudentIds.indexOf(originalStudent._id + '') === -1) {
            updates++;
        }
    });


    currentStudentIds.forEach(function (currentStudentId) {
        updates++;
    });


    originalTeachers.forEach(function (originalTeacher) {
        if (currentTeacherIds.indexOf(originalTeacher._id + '') === -1) {
            User.findOne({_id: originalTeacher._id}, 'teachesClasses').exec(function (err, originalTeacher) {
                originalTeacher.teachesClasses.splice(originalTeacher.teachesClasses.indexOf(schoolclass._id), 1);
                originalTeacher.save(function () {
                    updates--;
                    if (updates === 0) {
                        deferred.resolve();
                    }
                });
            });
        }
    });


    currentTeacherIds.forEach(function (currentTeacherId) {
        User.findOne({_id: currentTeacherId}, 'teachesClasses').exec(function (err, currentTeacher) {

            if (currentTeacher) {
                if (currentTeacher.teachesClasses.indexOf(schoolclass._id) === -1) {
                    currentTeacher.teachesClasses.push(schoolclass._id);
                }
                currentTeacher.save(function () {
                    updates--;
                    if (updates === 0) {
                        deferred.resolve();
                    }
                });
            }
        });
    });


    originalStudents.forEach(function (originalStudent) {
        if (currentStudentIds.indexOf(originalStudent._id + '') === -1) {
            User.findOne({_id: originalStudent._id}, 'studentInClasses').exec(function (err, originalStudent) {
                originalStudent.studentInClasses.splice(originalStudent.studentInClasses.indexOf(schoolclass._id), 1);
                originalStudent.save(function () {
                    updates--;
                    if (updates === 0) {
                        deferred.resolve();
                    }
                });
            });
        }
    });


    currentStudentIds.forEach(function (currentStudentId) {
        User.findOne({_id: currentStudentId}, 'studentInClasses').exec(function (err, currentStudent) {

            if (currentStudent) {
                if (currentStudent.studentInClasses.indexOf(schoolclass._id) === -1) {
                    currentStudent.studentInClasses.push(schoolclass._id);
                }
                currentStudent.save(function () {
                    updates--;
                    if (updates === 0) {
                        deferred.resolve();
                    }
                });
            }
        });
    });

    return deferred.promise;
};

/**
 * Update a Schoolclass
 */
exports.update = function (req, res) {

    var schoolclass = req.schoolclass;
    var originalTeachers = schoolclass.teachers;
    var originalStudents = schoolclass.students;
    var originalCourses = [];
    var originalTeacherIds = [];
    var originalStudentIds = [];


    for (var i = 0; i < schoolclass.teachers.length; i++) {
        originalTeacherIds.push(schoolclass.teachers[i]._id + '');

    }

    for (i = 0; i < schoolclass.students.length; i++) {
        originalStudentIds.push(schoolclass.students[i]._id + '');

    }

    for (i = 0; i < schoolclass.courses.length; i++) {
        originalCourses.push(schoolclass.courses[i] + '');
    }
    schoolclass = _.extend(schoolclass, req.body);


    var currentTeachers = schoolclass.teachers;
    var currentStudents = schoolclass.students;
    var currentCourses = [];
    var currentTeacherIds = [];
    var currentStudentIds = [];


    for (i = 0; i < schoolclass.teachers.length; i++) {
        currentTeacherIds.push(schoolclass.teachers[i]._id + '');
    }

    for (i = 0; i < schoolclass.students.length; i++) {
        currentStudentIds.push(schoolclass.students[i]._id + '');
    }

    for (i = 0; i < schoolclass.courses.length; i++) {
        currentCourses.push(schoolclass.courses[i] + '');
    }


    console.log('originalCourses');
    console.log(originalCourses);
    console.log('currentCourses');
    console.log(currentCourses);


    schoolclass.save(function (err, sc) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {

            updateUsers(originalTeachers, originalStudents, currentTeacherIds, currentStudentIds, schoolclass).then(
                function () {


                    var lockCourse = function (id, lock) {
                        Course.findOne({'_id': id}).exec(function (err, cs) {


                            cs.supervised = lock;
                            cs.save();
                        });
                    };

                    var findAndLockCourseFor = function (id, studentIds, lock) {
                        Course.findOne({'_id': id}).exec(function (err, cs) {

                            // student has a slave of our master
                            if (studentIds.indexOf(cs.user + '') > -1) {
                                lockCourse(cs._id, lock);
                            }

                        });

                    };


                    var handleSlavesFor = function (courseId, studentIds, lock) {
                        Course.findOne({'_id': courseId}).exec(function (err, cm) {


                            if (cm.slaves) {
                                for (var i = 0; i < cm.slaves.length; i++) {

                                    findAndLockCourseFor(cm.slaves[i], studentIds, lock);

                                }
                            }
                        });
                    };

                    var handleAddedStudent = function (userId, classCourses) {

                        var handleSlave = function (courseId, studentCourses, userId) {
                            getSlaves(courseId).promise.then(function (slaves) {
                                var found = false;
                                for (var j = 0; j < studentCourses.length; j++) {
                                    if (slaves.indexOf(studentCourses[j])) {
                                        lockCourse(studentCourses[j]._id, true);
                                        found = true;
                                    }
                                }
                                if (!found) {
                                    courses.copyCourse({query: {userId: userId}}, undefined, undefined, courseId);
                                }
                            });
                        };

                        Course.find({'user': userId}).exec(function (err, studentCourses) {
                            for (var i = 0; i < classCourses.length; i++) {
                                handleSlave(classCourses[i], studentCourses, userId);

                            }
                        });
                    };

                    var handleAddedCourse = function (courseId, currentStudentIds) {
                        var handleStudent = function (userId, courseId) {

                            Course.find({'user': userId}).exec(function (err, studentCourses) {
                                getSlaves(courseId).promise.then(function (slaves) {
                                    var found = false;
                                    for (var i = 0; i < studentCourses.length; i++) {
                                        if (slaves.indexOf(studentCourses[i]._id) > -1) {
                                            lockCourse(studentCourses[i]._id, true);
                                            found = true;
                                        }
                                    }
                                    if (!found) {
                                        courses.copyCourse({query: {userId: userId}}, undefined, undefined, courseId);
                                    }
                                });
                            });


                        };

                        for (var i = 0; i < currentStudentIds.length; i++) {
                            handleStudent(currentStudentIds[i], courseId);
                        }
                    };


                    var handleRemovedCourse = function (id, currentStudentIds) {
                        handleSlavesFor(id, currentStudentIds, false);
                    };

                    var getSlaves = function (id) {
                        var deferred = q.defer();
                        Course.findOne({'_id': id}).exec(function (err, cm) {


                            if (cm.slaves) {
                                deferred.resolve(cm.slaves);
                            }
                        });
                        return deferred;
                    };


                    var handleRemovedStudent = function (id, classCourses) {
                        for (var i = 0; i < classCourses.length; i++) {
                            handleSlavesFor(classCourses[i], [id], false);
                        }
                    };


                    for (i = 0; i < currentCourses.length; i++) {
                        if (originalCourses.indexOf(currentCourses[i] + '') === -1) {
                            console.log('handle added course');
                            handleAddedCourse(currentCourses[i], currentStudentIds);
                        }
                    }

                    for (i = 0; i < originalCourses.length; i++) {
                        if (currentCourses.indexOf(originalCourses[i] + '') === -1) {
                            console.log('handle removed course');
                            handleRemovedCourse(originalCourses[i], currentStudentIds);
                        }
                    }

                    for (i = 0; i < currentStudentIds.length; i++) {

                        if (originalStudentIds.indexOf(currentStudentIds[i] + '') === -1) {
                            console.log('handle added student');
                            handleAddedStudent(currentStudentIds[i], currentCourses);
                        }
                    }

                    for (i = 0; i < originalStudentIds.length; i++) {
                        if (currentStudentIds.indexOf(originalStudentIds[i] + '') === -1) {
                            console.log('handle removed student');
                            handleRemovedStudent(originalStudentIds[i], currentCourses);
                        }
                    }


                    res.jsonp(schoolclass);
                }
            );


        }
    });
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

    Schoolclass.findById(id).populate('user', 'displayName').populate('teachers', 'displayName').populate('students', 'displayName').populate('school', 'name').exec(function (err, schoolclass) {
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
