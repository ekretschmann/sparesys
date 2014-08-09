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

    console.log(id);

    Course.find({'user': req.query.userId}).exec(function (err, courses) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(courses);
        }
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

var copyCards = function (pack, originalCards, req) {


    var deferred = q.defer();
    var cardsLoaded = 0;
    var cardMap = {};

    if (originalCards.length === 0) {
        deferred.resolve(true);
        return deferred.promise;
    }

    originalCards.forEach(function (cardId) {
        var loadCard = Card.find({'_id': cardId}).exec(function (err) {
            if (err) {
                console.log(err);
            }
        });


        loadCard.then(function (cards) {

            var cardCopy = new Card();
            cardCopy.user = req.user;
            cardCopy.question = cards[0].question;
            cardCopy.answer = cards[0].answer;
            cardCopy.packs = [pack._id];


            cardCopy.save(function () {
                cardMap[cards[0]._id]  = cardCopy._id;
                cardsLoaded ++;
                if (cardsLoaded === originalCards.length) {
                    originalCards.forEach(function(originalCardId) {
                        pack.cards.push(cardMap[originalCardId]);
                    });

                    pack.save();

                }

            });
        });
    }, this);

    return deferred.promise;
};

var copyPacks = function (course, originalPacks, req) {

    var deferred = q.defer();
    var packagesLoaded = 0;
    var packMap = {};

    if (originalPacks.length === 0) {
        deferred.resolve(true);
    }
    originalPacks.forEach(function (packId) {

        var loadPack = Pack.find({'_id': packId}).exec(function (err) {
            if (err) {
                console.log(err);
            }
        });

        loadPack.then(function (packs) {


            var packCopy = new Pack();
            packCopy.user = req.user;
            packCopy.name = packs[0].name;
            packCopy.course = course._id;

            packCopy.save(function () {

                packMap[packs[0]._id]  = packCopy._id;
                packagesLoaded ++;

                var cardForPackMap = copyCards(packCopy, packs[0].cards, req);

                cardForPackMap.then(function(map) {

                    if (packagesLoaded === originalPacks.length) {

                        originalPacks.forEach(function(originalPackId) {
                            course.packs.push(packMap[originalPackId]);
                        });


                        course.save(function(result){
                            deferred.resolve(true);
                        });

                    }
                });


            });
        });
    }, this);

    return deferred.promise;
};

exports.copyCourse = function (req, res, next, id) {

    var cardMap = {};

    var loadCourse = Course.find({'_id': id}).exec(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        }
    });

    loadCourse.then(function (courses) {

        var courseCopy = new Course();
        courseCopy.user = req.user;
        courseCopy.name = courses[0].name;
        courseCopy.description = courses[0].description;
        courseCopy.language = courses[0].language;

        courseCopy.save(function () {

            copyPacks(courseCopy, courses[0].packs, req).then(function (result) {
//                console.log(result);
                res.jsonp(courseCopy);
            });
        });

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




