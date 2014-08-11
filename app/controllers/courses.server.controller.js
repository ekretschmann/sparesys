'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Course = mongoose.model('Course'),
    Pack = mongoose.model('Pack'),
    Card = mongoose.model('Card'),
    _ = require('lodash'),
    q = require('q');

/**
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
    course.updated = Date.now();

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
    } else if (req.query.published) {

        Course.find({'published': req.query.published}).exec(function (err, courses) {
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


var copyCards = function (cardIds, userId, newPackId) {
    var idMap = {};
    var cardsToCopy = cardIds.length;
    var cardsCopied = 0;
    cardIds.forEach(function(cardId) {
        console.log('    copying card: '+cardId);
        var findCard = Pack.find({'_id': cardId}).exec(function (err) {
            if (err) {
                console.log('Error: '+err);
            }
        });

        findCard.then(function(findCardResult) {
            var original = findCardResult[0];
            console.log('    loaded: '+ original.question);
            var copy = new Card();
            copy.user = userId;
            copy.question = original.question;
            copy.anser = original.answer;
            copy.packs = [newPackId];
            copy.save();

            idMap[original._id] = copy._id;

            cardsCopied++;
            if (cardsCopied === cardsToCopy) {
                var result = [];
                cardIds.forEach(function(cardId) {
                    result.push(idMap[cardId]);
                });
                return result;
            }
        });
    });
};

var copyPacks = function (packIds, userId, newCourseId) {
    var idMap = {};
    var packsToCopy = packIds.length;
    var packsCopied = 0;
    packIds.forEach(function(packId) {
        console.log('  copying pack: '+packId);
        var findPack = Pack.find({'_id': packId}).exec(function (err) {
            if (err) {
                console.log('Error: '+err);
            }
        });

        findPack.then(function(findPackResult) {
            var original = findPackResult[0];
            console.log('  loaded: '+ original.name);
            var copy = new Pack();
            copy.user = userId;
            copy.name = original.name;
            copy.course = newCourseId;
            idMap[original._id] = copy._id;
            copy.cards = copyCards(original.cards, userId, copy._id);
            copy.save();

            packsCopied++;
            if (packsCopied === packsToCopy) {
                var result = [];
                packIds.forEach(function(packId) {
                    result.push(idMap[packId]);
                });
                return result;
            }
        });
    });
};

exports.copyCourse = function (req, res, next, id) {

    var userId;
    if (req.query.userId) {
        userId = req.query.userId;
        console.log('student');
    } else {
        userId = req.user;
        console.log('this user');
    }

    console.log('copy for user '+userId);
    console.log(id);
    var findCourse = Course.find({'_id': id}).exec(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        }
    });

    findCourse.then(function(findCourseResult) {
        var original = findCourseResult[0];
        console.log('loaded: '+ original.name);
        var copy = new Course();
        copy.user = userId;
        copy.name = original.name;
        copy.description = original.description;
        copy.language = original.language;
        copy.packs = copyPacks(original.packs, userId, copy._id);
        copy.save();
//        copyPacks(original.packs, userId).then(function (result) {
//            res.jsonp(true);
//        });
        res.jsonp(true);
    });

};


exports.getCardsForCourse = function (req, res, next, id) {

    var result = [];
    var expectedCards = 0;
    var loadCourse = Course.find({'_id': id}).exec(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        }
    });

    loadCourse.then(function (courses) {
        courses[0].packs.forEach(function (packId) {
            var loadPack = Pack.find({'_id': packId}).exec(function (err) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                }
            });
            loadPack.then(function (packs) {
                expectedCards += packs[0].cards.length;
                packs[0].cards.forEach(function (cardId) {
                    var loadCard = Card.find({'_id': cardId}).exec(function (err) {
                        if (err) {
                            return res.send(400, {
                                message: getErrorMessage(err)
                            });
                        }
                    });
                    loadCard.then(function (card) {
                        result = result.concat(card);
                        if (result.length === expectedCards) {
                            res.jsonp(result);
                        }
                    });

                });
            });
        });

    });


};




