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


exports.updateDefaultSettings = function (req, res) {
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
 * Update a Course
 */
exports.update = function (req, res) {


    var course = req.course;


    var packsBefore = course.packs;
    course = _.extend(course, req.body);

    course.updated = Date.now();
    var newPack;

    course.packs.forEach(function (pack) {
        if (packsBefore.indexOf(pack) === -1) {
            newPack = pack;
        }
    }, this);
    course.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {

            course.slaves.forEach(function (cid) {
                Course.findOne({'_id': cid}).exec(function (err, c) {

                    if (err) {
                        console.log(err);
                    } else {

                        if (c) {
                            c.name = course.name;
                            c.description = course.description;
                            //c.language = course.language;
                            c.front = course.front;
                            c.back = course.back;
                            //c.languageback = course.languageback;
                            //c.speechrecognition = course.speechrecognition;
                            c.cardDefaults = course.cardDefaults;
                            c.save();

                            if (newPack) {
                                Pack.findOne({'_id': newPack}).exec(function (err, p) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        var addedPack = new Pack();
                                        addedPack.user = c.user;
                                        addedPack.course = c._id;
                                        addedPack.name = p.name;
                                        addedPack.checks = p.checks;
                                        addedPack.modes = p.modes;
                                        addedPack.master = p._id;

                                        c.packs.push(addedPack._id);
                                        p.slaves.push(addedPack._id);
                                        addedPack.save();
                                        c.save();
                                        p.save();
                                    }
                                });
                            }
                        }

                    }
                });
            }, this);

            res.jsonp(course);
        }
    });

};

/**
 * Delete an Course
 */
exports.delete = function (req, res) {


    var course = req.course;


    course.packs.forEach(function (pack) {
        Pack.find({'_id': pack}).exec(function (err, packs) {
            if (packs && packs[0]) {

                packs[0].cards.forEach(function (card) {
                    Card.find({'_id': card}).exec(function (err, cards) {
                        if (cards && cards[0]) {
                            cards[0].remove();
                        }
                    });
                });
                packs[0].remove();
            }
        });
    });

    Course.find({'_id': course._id}).exec(function (err, courses) {

        if (courses && courses[0]) {

            courses[0].slaves.forEach(function (cid) {
                Course.find({'_id': cid}).exec(function (err, c) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (c && c.length === 1) {
                            c[0].master = undefined;
                            c[0].supervised = false;
                            c[0].visible = true;
                            c[0].save();
                        }
                    }
                });


            });

            // Remove course from master slave list
            Course.find({'_id': courses[0].master}).exec(function (err, c) {
                if (err) {
                    console.log(err);
                } else {
                    if (c && c.length === 1) {

                        var index = c[0].slaves.indexOf(courses[0]._id);
                        c[0].slaves.splice(index, 1);
                        c[0].save();
                    }
                }
            });

            courses[0].remove();


        }
    });

    res.jsonp(true);
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
    } else if (req.query.text || req.query.text === '') {

        var search = req.query.text.split(' ');
        if (req.query.published) {




            Course.find(
                {
                    $and: [{'published': req.query.published},
                        {$or: [
                            {'name': {$regex: '^' + search[0]}},
                            {'description': {$regex: '^' + search[0]}}]}
                    ]
                }).

                limit(25).populate('user', 'displayName').exec(function (err, courses) {
                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(courses);
                    }
                });


        } else {
            Course.find({
                $or: [
                    {'name': {$regex: '^' + search[0]}},
                    {'description': {$regex: '^' + search[0]}}]
            }).
                limit(25).populate('user', 'displayName').exec(function (err, courses) {
                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(courses);
                    }
                });
        }
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


var copyCards = function (cardIds, userId, newCourseId, newPackId, isSupervised) {
    var idMap = {};
    var cardsToCopy = cardIds.length;
    var cardsCopied = 0;
    var deferred = q.defer();
    if (cardIds.length === 0) {
        deferred.resolve([]);
        return deferred.promise;
    }

    cardIds.forEach(function (cardId) {

        var findCard = Card.find({'_id': cardId}).exec(function (err) {
            if (err) {
                console.log('Error: ' + err);
            }
        });

        findCard.then(function (findCardResult) {
            var original = findCardResult[0];
            var copy = new Card();
            copy.user = userId;


            copy.imagesReadFront = original.imagesReadFront;
            copy.speechRecognitionImages = original.speechRecognitionImages;
            copy.imagesReadBack = original.imagesReadBack;
            copy.languageFront = original.languageFront;
            copy.languageBack = original.languageBack;
            copy.modes = original.modes;
            copy.readFrontForward = original.readFrontForward;
            copy.readBackForward = original.readBackForward;
            copy.readFrontReverse = original.readFrontReverse;
            copy.readBackReverse = original.readBackReverse;
            copy.speechRecognitionForward = original.speechRecognitionForward;
            copy.speechRecognitionReverse = original.speechRecognitionReverse;
            copy.acceptedAnswersForward = original.acceptedAnswersForward;
            copy.invalidAnswersForward = original.invalidAnswersForward;
            copy.acceptedAnswersReverse = original.acceptedAnswersReverse;
            copy.invalidAnswersReverse = original.invalidAnswersReverse;
            copy.question = original.question;
            copy.answer = original.answer;

            copy.check = original.check;
            copy.images = original.images;
            copy.packs = [newPackId];
            copy.master = original._id;
            copy.supervisor = original.user;
            copy.format = original.format;
            copy.course = newCourseId;

            if (isSupervised) {
                copy.dueDate = original.dueDate;
                copy.startDate = original.startDate;
            }

            copy.save();


            if (isSupervised) {


                if (!original.slaves) {
                    original.slaves = [];
                }
                if (original.slaves.indexOf(copy._id) === -1) {
                    original.slaves.push(copy._id);
                    original.save();
                }
            }


            idMap[original._id] = copy._id;

            cardsCopied++;

            if (cardsCopied === cardsToCopy) {

                var result = [];
                cardIds.forEach(function (cardId) {
                    result.push(idMap[cardId]);
                });
                deferred.resolve(result);
            }
        });
    });
    return deferred.promise;
};

var copyPacks = function (packIds, userId, newCourseId, isSupervised) {
    var idMap = {};
    var packsToCopy = packIds.length;
    var packsCopied = 0;
    var deferred = q.defer();
    if (packIds.length === 0) {
        deferred.resolve([]);
        return deferred.promise;
    }

    packIds.forEach(function (packId) {
        var findPack = Pack.find({'_id': packId}).exec(function (err) {
            if (err) {
                console.log('Error: ' + err);
            }
        });

        findPack.then(function (findPackResult) {
            var original = findPackResult[0];
            var copy = new Pack();
            copy.user = userId;
            copy.name = original.name;
            copy.course = newCourseId;
            copy.master = original._id;
            idMap[original._id] = copy._id;
            var cardPromise = copyCards(original.cards, userId, newCourseId, copy._id, isSupervised);

            cardPromise.then(function (cards) {
                copy.cards = cards;
                copy.save(function () {
                });
            });
            if (isSupervised) {
                if (!original.slaves) {
                    original.slaves = [];
                }
                if (original.slaves.indexOf(copy._id) === -1) {

                    original.slaves.push(copy._id);
                    original.save();
                }
            }

            packsCopied++;

            if (packsCopied === packsToCopy) {
                var result = [];
                packIds.forEach(function (packId) {

                    result.push(idMap[packId]);
                });
                deferred.resolve(result);
            }
        });
    });
    return deferred.promise;
};


var uploadCards = function (cards, userId, newPackId) {
    var idMap = {};
    var cardsToCopy = cards.length;
    var cardsCopied = 0;
    var deferred = q.defer();
    if (cards.length === 0) {
        deferred.resolve([]);
        return deferred.promise;
    }

    cards.forEach(function (card) {
        var copy = new Card();
        copy.user = userId;
        copy.question = card.question;
        copy.answer = card.answer;
        copy.packs = [newPackId];
        copy.save();

        idMap[card.id] = copy._id;

        cardsCopied++;
        if (cardsCopied === cardsToCopy) {
            var result = [];
            cards.forEach(function (card) {
                result.push(idMap[card.id]);
            });
            deferred.resolve(result);
        }

    });
    return deferred.promise;
};

var uploadPacks = function (packs, userId, newCourseId) {
    var idMap = {};
    var packsToCopy = packs.length;
    var packsCopied = 0;
    var deferred = q.defer();
    if (packs.length === 0) {
        deferred.resolve([]);
        return deferred.promise;
    }

    packs.forEach(function (pack) {
        var copy = new Pack();
        copy.user = userId;
        copy.name = pack.name;
        copy.course = newCourseId;
        idMap[pack.id] = copy._id;
        var cardPromise = uploadCards(pack.cards, userId, copy._id);
        cardPromise.then(function (cards) {
            copy.cards = cards;
            copy.save();
        });


        packsCopied++;
        if (packsCopied === packsToCopy) {
            var result = [];
            packs.forEach(function (pack) {

                result.push(idMap[pack.id]);
            });
            deferred.resolve(result);
        }
    });

    return deferred.promise;
};

exports.upload = function (req, res, next) {
    var course = req.body.course;
    var userId = req.user;

    var copy = new Course();
    copy.user = userId;
    copy.name = course.name;
    copy.description = course.description;
    var packPromise = uploadPacks(course.packs, userId, copy._id);

    packPromise.then(function (packs) {
        copy.packs = packs;
        copy.save();
    });
};


exports.getCardsForCourse = function (req, res, next, id) {


    var result = [];


    var expectedCards = 0;
    var packOrder = {};

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
                packOrder[packs[0]._id] = packs[0].cards;
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
                            var ordered = [];
                            courses[0].packs.forEach(function (packId) {

                                packOrder[packId].forEach(function (cardId) {
                                    result.forEach(function (item) {

                                        if (item._id.toString() === cardId.toString() && item.packs[0].toString() === packId.toString()) {
                                            ordered.push(item);
                                        }
                                    });
                                });
                            });
                            res.jsonp(ordered);
                        }
                    });

                });
            });
        });

    });

};

exports.cardDefaults = function (req, res, next, id) {
    //console.log(req);
};


exports.removeDanglingPackSlaves = function (req, res, next, id) {

    //console.log('removing pack slaves');

    var checkIfPackExists = function(id) {
        var deferred = q.defer();
        Pack.findById(id).exec(function (err, pack) {

            if (!pack || err) {
                deferred.resolve({id: id, exists: false});
            } else {
                deferred.resolve({id: id, exists: true});
            }
        });
        return deferred.promise;
    };

    var checkAllSlaves = function(pack) {
        var allSlaves = pack.slaves;
        var newSlaves = [];
        var target = allSlaves.length;
        var processed = 0;


        var processResult = function (result) {

            processed++;
            if (result.exists) {
                newSlaves.push(result.id);
            }
            if (processed === target) {
                pack.slaves = newSlaves;
                pack.save();
            }
        };


        for (var i=0; i<allSlaves.length; i++) {
            checkIfPackExists(allSlaves[i]).then(processResult);
        }

    };




    Course.findById(id).populate('packs').exec(function (err, course) {
        if (err) return next(err);
        if (!course) return next(new Error('Failed to load Course ' + id));


        for (var i=0; i< course.packs.length; i++) {

            if (course.packs[i].slaves) {
                checkAllSlaves(course.packs[i]);
            }
        }

        res.jsonp('ok');

        next();
    });


};

exports.copyCourse = function (req, res, next, id) {


    var userId;
    var isSupervised = false;

    if (req.query.userId) {
        userId = req.query.userId;
        isSupervised = true;
    } else {
        userId = req.user;
    }

    var userHasCourse = false;
    Course.find()
        .where('user').equals(userId)
        .exec(function (err, courses) {
            if (err) {
                console.log(err);
                return undefined;
            } else {
                for (var i = 0; i < courses.length; i++) {
                    if (courses[i].master + '' === id + '') {
                        userHasCourse = true;
                    }
                }

                if (userHasCourse) {
                    return undefined;
                }

                var findCourse = Course.find({'_id': id}).exec(function (err) {

                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    }
                });


                findCourse.then(function (findCourseResult) {


                    var original = findCourseResult[0];

                    var copy = new Course();

                    copy.user = userId;
                    copy.name = original.name;
                    copy.description = original.description;
                    //copy.languageFront = original.languageFront;
                    //copy.languageBack = original.languageBack;
                    copy.front = original.front;
                    copy.back = original.back;
                    copy.master = original._id;
                    copy.supervised = isSupervised;
                    copy.cardDefaults = original.cardDefaults;

                    if (req.query && req.query.target && req.query.target.toString() === 'teach') {
                        copy.teaching = true;
                    }
                    if (!original.slaves) {
                        original.slaves = [];
                    }
                    original.slaves.push(copy._id);


                    original.save(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });

                    var packPromise = copyPacks(original.packs, userId, copy._id, isSupervised);


                    packPromise.then(function (packs) {
                        copy.packs = packs;


                        copy.save(function () {

                            if (res && res.jsonp) {
                                res.jsonp('ok');
                            }
                            return copy;
                        });
                    });


                });
            }
        });


};
