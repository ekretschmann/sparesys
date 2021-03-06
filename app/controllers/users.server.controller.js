'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    User = mongoose.model('User'),
    Schoolclass = mongoose.model('Schoolclass'),
    School = mongoose.model('School'),
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
                message = 'Username already exists';
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
 * Signup
 */
exports.signup = function (req, res) {

    // For security measurement we remove the roles from the req.body object
    delete req.body.roles;

    // Init Variables
    var user = new User(req.body);


    var message = null;

    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;

    user.inventory = [];

    // Then save the user
    user.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {


            // Remove sensitive data before login
            user.password = undefined;
            user.salt = undefined;

            req.login(user, function (err) {
                if (err) {
                    res.send(400, err);
                } else {
                    res.jsonp(user);
                }
            });
        }
    });
};

/**
 * Signup
 */
exports.addTeacher = function (req, res) {
//    delete req.body.roles;


    // Init Variables
    var user = new User(req.body);

    user.roles.push('teacher');

//    if (isTeacher) {
//        user.roles.push('teacher');
//    }
    var message = null;

    // Add missing user fields
    user.provider = 'local';
    user.displayName = user.firstName + ' ' + user.lastName;

    // Then save the user

    user.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(user);
        }
    });
};


/**
 * Signin after passport authentication
 */
exports.signin = function (req, res, next) {


    //console.log(req.body);


    //User.findById('540ad3ef1fb43c02007231d3', function (err, user) {
    //
    //    //console.log(user);
    //    req.login(user, function (err) {
    //                    if (err) {
    //                        res.send(400, err);
    //                    } else {
    //                        res.jsonp(user);
    //                    }
    //                });
    //
    //});
    //
    passport.authenticate('local', function (err, user, info) {

        if (err || !user) {
            res.send(400, info);
        } else {
            // Remove sensitive data before login

            // user.lastLogin = Date.now();

            var now = Date.now();
            User.findById(user._id,'-salt -password -__v -provider', function (err, user) {

                user.lastLogin = now;
                user.save();

            });


            user.password = undefined;
            user.salt = undefined;
            user.lastLogin = now;


            req.login(user, function (err) {

                if (err) {
                    res.send(400, err);
                } else {
                    res.jsonp(user);
                }
            });
        }
    })(req, res, next);
};

var updateSchoolForTeacher = function (theUser, req) {

    function removeTeacherFromSchool(id, theUser) {
        School.findOne({_id: id}).exec(function (err, s) {
            if (!err) {
                if (s.teachers.indexOf(theUser._id) > -1) {
                    s.teachers.splice(s.teachers.indexOf(theUser._id), 1);
                    s.save();
                }
            }
        });
    }

    function addTeacherToSchool(id, theUser) {

        School.findOne({_id: id}).exec(function (err, s) {

            if (!err) {
                s.teachers.push(theUser._id);
                s.save();
            }
        });
    }

    var originalSchools = theUser.teacherInSchools;
    var newSchools = req.body.teacherInSchools;


    var deletedSchools = [];
    for (var i = 0; i < originalSchools.length; i++) {
        if (newSchools.indexOf(originalSchools[i] + '') === -1) {
            deletedSchools.push(originalSchools[i] + '');
        }
    }

    for (i = 0; i < deletedSchools.length; i++) {
        removeTeacherFromSchool(deletedSchools[i], theUser);
    }

    var addedSchools = [];
    for (i = 0; i < newSchools.length; i++) {
        if (originalSchools.indexOf(newSchools[i]) === -1) {
            addedSchools.push(newSchools[i]);
        }
    }

    for (i = 0; i < addedSchools.length; i++) {
        addTeacherToSchool(addedSchools[i], theUser);
    }
};

var updateSchoolForStudent = function (theUser, req) {

    function removeStudentFromSchool(id, theUser) {
        School.findOne({_id: id}).exec(function (err, s) {
            if (!err && s) {
                if (s.students.indexOf(theUser._id) > -1) {
                    s.students.splice(s.students.indexOf(theUser._id), 1);
                    s.save();
                }
            }
        });
    }

    function addStudentToSchool(id, theUser) {
        School.findOne({_id: id}).exec(function (err, s) {


            if (!err && s) {
                if (s.students.indexOf(theUser._id) === -1) {
                    s.students.push(theUser._id);
                    s.save();
                }
            }
        });
    }

    var originalSchools = theUser.studentInSchools;
    var newSchools = req.body.studentInSchools;

    var deletedSchools = [];
    for (var i = 0; i < originalSchools.length; i++) {
        if (newSchools.indexOf(originalSchools[i] + '') === -1) {
            deletedSchools.push(originalSchools[i] + '');
        }
    }

    for (i = 0; i < deletedSchools.length; i++) {
        removeStudentFromSchool(deletedSchools[i], theUser);
    }

    var addedSchools = [];
    for (i = 0; i < newSchools.length; i++) {
        if (originalSchools.indexOf(newSchools[i]) === -1) {
            addedSchools.push(newSchools[i]);
        }
    }

    for (i = 0; i < addedSchools.length; i++) {
        addStudentToSchool(addedSchools[i], theUser);
    }
};

/**
 * Update user details
 */
exports.update = function (req, res) {



    // Init Variables
    var user = req.user;



    var message = null;


    // you can not add an admin role when you are not an admin
    if (req.body.roles) {
        if (req.body.roles.indexOf('admin') > -1) {
            if (req.user.roles.indexOf('admin') === -1) {
                return res.send(400, {
                    message: getErrorMessage('forbidden')
                });
            }

        }
    }

    function removeTeacherFromSchoolclass(id, theUser) {
        Schoolclass.findOne({_id: id}).exec(function (err, sc) {
            if (!err) {
                if (sc.teachers.indexOf(theUser._id) > -1) {
                    sc.teachers.splice(sc.teachers.indexOf(theUser._id), 1);
                    sc.save();
                }
            }
        });
    }


    function removeStudentFromSchoolclass(id, theUser) {
        Schoolclass.findOne({_id: id}).exec(function (err, sc) {
            if (!err) {
                if (sc.students.indexOf(theUser._id) > -1) {
                    sc.students.splice(sc.students.indexOf(theUser._id), 1);
                    sc.save();
                }
            }
        });
    }

    function updateUser(theUser) {


        updateSchoolForTeacher(theUser, req);
        updateSchoolForStudent(theUser, req);

        var originalClassesRaw = theUser.teachesClasses;
        var newClasses = req.body.teachesClasses;
        var originalClasses = [];
        for (var i = 0; i < originalClassesRaw.length; i++) {
            originalClasses.push(originalClassesRaw[i] + '');
        }

        var deletedClasses = [];
        for (i = 0; i < originalClasses.length; i++) {
            if (newClasses.indexOf(originalClasses[i]) === -1) {
                deletedClasses.push(originalClasses[i]);
            }
        }

        for (i = 0; i < deletedClasses.length; i++) {
            removeTeacherFromSchoolclass(deletedClasses[i], theUser);
        }


        originalClassesRaw = theUser.studentInClasses;
        newClasses = req.body.studentInClasses;
        originalClasses = [];
        for (i = 0; i < originalClassesRaw.length; i++) {
            originalClasses.push(originalClassesRaw[i] + '');
        }
        deletedClasses = [];
        for (i = 0; i < originalClasses.length; i++) {
            if (newClasses.indexOf(originalClasses[i]) === -1) {
                deletedClasses.push(originalClasses[i]);
            }
        }

        for (i = 0; i < deletedClasses.length; i++) {
            removeStudentFromSchoolclass(deletedClasses[i], theUser);
        }


        theUser = _.extend(theUser, req.body);
        theUser.updated = Date.now();
        theUser.displayName = theUser.firstName + ' ' + theUser.lastName;


        if (theUser.teachesClasses === '') {
            theUser.teachesClasses = undefined;
        }
        if (!theUser.inventory) {
            theUser.inventory = [];
        }


        theUser.save(function (err) {

            if (err) {
                console.log(err);
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {


                req.login(user, function (err) {
                    if (err) {
                        res.send(400, err);
                    } else {
                        res.jsonp(theUser);
                    }
                });
            }
        });


        //res.jsonp(theUser);
    }

    if (user) {
        if (req.body._id.toString() !== user._id.toString()) {
            User.findById(req.body._id, '-salt -password -__v -provider', function (err, otherUser) {

                if (!err && otherUser) {
                    if (user.roles.indexOf('admin') === -1) {
                        return res.send(400, {
                            message: 'not authorized'
                        });
                    } else {

                        updateUser(otherUser);
                    }
                } else {
                    console.log(err);
                }
            });
        } else {
            updateUser(user);
        }
    } else {
        res.send(400, {
            message: 'User is not signed in'
        });
    }
};


exports.changeUserPassword = function (req, res, next) {
    User.findById(req.body.otherUser, function (err, user) {

        if (!err && user) {
            user.password = req.body.password;

            if (!user.inventory) {
                user.inventory = [];
            }
            user.save(function (err) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    req.login(user, function (err) {
                        if (err) {
                            res.send(400, err);
                        } else {
                            res.send({
                                message: 'Password changed successfully'
                            });
                        }
                    });
                }
            });

        } else {
            res.send(400, {
                message: 'User is not found'
            });
        }
    });
};
/**
 * Change Password
 */
exports.changePassword = function (req, res, next) {

    // Init Variables
    var passwordDetails = req.body;
    var message = null;

    if (req.user) {
        User.findById(req.user.id, function (err, user) {
            if (!err && user) {
                if (user.authenticate(passwordDetails.currentPassword)) {
                    if (passwordDetails.newPassword === passwordDetails.verifyPassword) {
                        user.password = passwordDetails.newPassword;

                        if (!user.inventory) {
                            user.inventory = [];
                        }
                        user.save(function (err) {
                            if (err) {
                                return res.send(400, {
                                    message: getErrorMessage(err)
                                });
                            } else {
                                req.login(user, function (err) {
                                    if (err) {
                                        res.send(400, err);
                                    } else {
                                        res.send({
                                            message: 'Password changed successfully'
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.send(400, {
                            message: 'Passwords do not match'
                        });
                    }
                } else {
                    res.send(400, {
                        message: 'Current password is incorrect'
                    });
                }
            } else {
                res.send(400, {
                    message: 'User is not found'
                });
            }
        });
    } else {
        res.send(400, {
            message: 'User is not signed in'
        });
    }
};

/**
 * Signout
 */
exports.signout = function (req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Send User
 */
exports.me = function (req, res) {

    res.jsonp(req.user || null);
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
    return function (req, res, next) {
        passport.authenticate(strategy, function (err, user, redirectURL) {
            if (err || !user) {
                return res.redirect('/#!/signin');
            }
            req.login(user, function (err) {
                if (err) {
                    return res.redirect('/#!/signin');
                }

                return res.redirect(redirectURL || '/');
            });
        })(req, res, next);
    };
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {


    User.findOne({
        _id: id
    }).exec(function (err, user) {


        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
    });
};

/**
 * Require login routing middleware
 */
exports.requiresLogin = function (req, res, next) {

    if (!req.isAuthenticated()) {
        return res.send(401, {
            message: 'User is not logged in'
        });
    }

    next();
};

/**
 * User authorizations routing middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.roles.indexOf('admin') === -1) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }

    //
    //var _this = this;
    //
    //return function (req, res, next) {
    //    _this.requiresLogin(req, res, function () {
    //        if (_.intersection(req.user.roles, roles).length) {
    //            return next();
    //        } else {
    //            return res.send(403, {
    //                message: 'User is not authorized'
    //            });
    //        }
    //    });
    //};
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
    if (!req.user) {
        // Define a search query fields
        var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
        var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

        // Define main provider search query
        var mainProviderSearchQuery = {};
        mainProviderSearchQuery.provider = providerUserProfile.provider;
        mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define additional provider search query
        var additionalProviderSearchQuery = {};
        additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        // Define a search query to find existing user with current provider profile
        var searchQuery = {
            $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
        };

        User.findOne(searchQuery, function (err, user) {
            if (err) {
                return done(err);
            } else {
                if (!user) {
                    var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

                    User.findUniqueUsername(possibleUsername, null, function (availableUsername) {
                        user = new User({
                            firstName: providerUserProfile.firstName,
                            lastName: providerUserProfile.lastName,
                            username: availableUsername,
                            displayName: providerUserProfile.displayName,
                            email: providerUserProfile.email,
                            provider: providerUserProfile.provider,
                            providerData: providerUserProfile.providerData
                        });

                        // And save the user
                        if (!user.inventory) {
                            user.inventory = [];
                        }
                        user.save(function (err) {
                            return done(err, user);
                        });
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    } else {
        // User is already logged in, join the provider data to the existing user
        User.findById(req.user.id, function (err, user) {
            if (err) {
                return done(err);
            } else {
                // Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
                if (user && user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
                    // Add the provider data to the additional provider data field
                    if (!user.additionalProvidersData) user.additionalProvidersData = {};
                    user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

                    // Then tell mongoose that we've updated the additionalProvidersData field
                    user.markModified('additionalProvidersData');

                    // And save the user
                    if (!user.inventory) {
                        user.inventory = [];
                    }
                    user.save(function (err) {
                        return done(err, user, '/#!/settings/accounts');
                    });
                } else {
                    return done(err, user);
                }
            }
        });
    }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
    var user = req.user;
    var provider = req.param('provider');

    if (user && provider) {
        // Delete the additional provider
        if (user.additionalProvidersData[provider]) {
            delete user.additionalProvidersData[provider];

            // Then tell mongoose that we've updated the additionalProvidersData field
            user.markModified('additionalProvidersData');
        }

        if (!user.inventory) {
            user.inventory = [];
        }
        user.save(function (err) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                req.login(user, function (err) {
                    if (err) {
                        res.send(400, err);
                    } else {
                        res.jsonp(user);
                    }
                });
            }
        });
    }
};

/**
 * List of Users
 */
exports.list = function (req, res) {

    if (req.query && req.query.text) {
        var search = req.query.text.split(' ');

        if (search.length === 1) {
            User.find({$or: [{'firstName': {$regex: '^' + search[0]}}, {'lastName': {$regex: '^' + search[0]}}]}).limit(25).exec(function (err, users) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(users);
                }
            });
        } else if (search.length === 2) {
            User.find({$and: [{'firstName': {$regex: '^' + search[0]}}, {'lastName': {$regex: '^' + search[1]}}]}).limit(25).exec(function (err, users) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(users);
                }
            });
        } else {
            res.jsonp([]);
        }
    } else {

        User.find({}, '-salt -password -__v -provider').sort('-created').populate('_id').exec(function (err, users) {

            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(users);
            }
        });
    }
};

/**
 * Show another user
 */
exports.read = function (req, res) {

    // .populate('administersSchools', 'name')
    User.findOne({_id: req.profile.id}, '-salt -password -__v -provider').exec(function (err, user) {

        res.jsonp(user);
    });


};

/**
 * Delete an User
 */
exports.delete = function (req, res) {
    var usr = req.profile;

    usr.remove(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(usr);
        }
    });
};

