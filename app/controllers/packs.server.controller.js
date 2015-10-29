'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Pack = mongoose.model('Pack'),
    Course = mongoose.model('Course'),
    Card = mongoose.model('Card'),
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
                message = 'Pack already exists';
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
 * Create a Pack
 */
exports.create = function (req, res) {
    var pack = new Pack(req.body);
    pack.user = req.user;

    pack.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(pack);
        }
    });
};

/**
 * Show the current Pack
 */
exports.read = function (req, res) {
    res.jsonp(req.pack);
};

/**
 * Update a Pack
 */
exports.update = function (req, res) {
    var pack = req.pack;


    pack = _.extend(pack, req.body);
    pack.updated = Date.now();


    if (pack.slaves) {
        pack.slaves.forEach(function (slaveId) {
            Pack.find({'_id': slaveId}).exec(function (err, packs) {
                if (err) {
                    console.log(err);
                } else {
                    if (packs.length === 1) {
                        packs[0].name = pack.name;
                        packs[0].save();
                    }
                }
            });
        }, this);
    }


    pack.save(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(pack);
        }
    });
};

var removePack = function (pack) {


    pack.cards.forEach(function (cardId) {
        Card.find({'_id': cardId}).exec(function (err, cards) {
            if (cards && cards.length === 1) {
                var card = cards[0];
                if (card.slaves && card.slaves.length > 0) {
                    card.slaves.forEach(function (slaveId) {
                        Card.find({'_id': slaveId}).exec(function (err, slaves) {
                            slaves[0].remove();
                        });
                    });
                }
                card.remove();

            }
        });
    });

    Course.find({'_id': pack.course}).exec(function (err, courses) {
        if (courses && courses.length === 1) {


            for (var i in courses[0].packs) {
                if (courses[0].packs[i].toString() === pack._id.toString()) {
                    courses[0].packs.splice(i, 1);
                }
            }

            courses[0].save(function (err) {
                if (err) {
                    console.log(err);
                } else {

                    pack.remove(function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        } else {

            console.log('d');
            pack.remove(function (err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });


};

/**
 * Delete a Pack
 */
exports.delete = function (req, res) {
    var pack = req.pack;


    //pack.slaves.forEach(function (slaveId) {
    //    Pack.findOne({'_id': slaveId}).exec(function (err, p) {
    //        removePack(p);
    //    });
    //});

    removePack(pack);

    res.jsonp('ok');
};

var getPackTree = function(id) {
    var deferred = q.defer();
    var packs = [id];
    Pack.findOne({'_id': id}).exec(function (err, p) {

        for (var i=0; i< p.slaves.length; i++) {
            packs.push(p.slaves[i]);
        }

        deferred.resolve(packs);

    });
    return deferred.promise;
};


var updateCard = function(cardId, req) {
    var settings = req.settings;
    var deferred = q.defer();

    console.log(settings);
    Card.findOne({'_id': cardId }).exec(function (err, card) {
        if (settings.languageFront) {
            card.languageFront = settings.languageFront;
        }
        if (settings.languageBack) {
            card.languageBack = settings.languageBack;
        }
        if (settings.priority) {
            card.priority = settings.priority;
        }
        if (settings.checks) {
            card.check = settings.checks;
            if (card.check === 'Self Checks') {
                card.check = 'self';
            }
        }
        if (settings.startDate) {
            if (settings.startDate === 'reset') {
                card.startDate = undefined;
            } else {
                card.startDate = settings.startDate;
            }
        }
        if (settings.dueDate) {
            if (settings.dueDate === 'reset') {
                card.dueDate = undefined;
            } else {
                card.dueDate = settings.dueDate;
            }
        }

        if (settings.forwardEnabled) {
            if (card.modes.indexOf('forward') === -1) {
                card.modes.push('forward');
            }


            if (settings.forwardReadFront === true || settings.forwardReadFront === false) {
                card.readFrontForward = settings.forwardReadFront;
            }
            if (settings.forwardReadBack === true || settings.forwardReadBack === false) {
                card.readBackForward = settings.forwardReadBack;
            }
            if (settings.forwardSpeechRecognition === true || settings.forwardSpeechRecognition === false) {
                card.speechRecognitionForward = settings.forwardSpeechRecognition;
            }


        } else {
            if (settings.forwardEnabled === false) {
                if (card.modes.indexOf('forward') > -1) {
                    card.modes.splice(card.modes.indexOf('forward'),1);
                }
            }
        }

        if (settings.reverseEnabled) {
            if (card.modes.indexOf('reverse') === -1) {
                card.modes.push('reverse');
            }


            if (settings.reverseReadFront === true || settings.reverseReadFront === false) {
                card.readFrontReverse = settings.reverseReadFront;
            }
            if (settings.reverseReadBack === true || settings.reverseReadBack === false) {
                card.readBackReverse = settings.reverseReadBack;
            }
            if (settings.reverseSpeechRecognition === true || settings.reverseSpeechRecognition === false) {
                card.speechRecognitionReverse = settings.reverseSpeechRecognition;
            }


        } else {
            if (settings.reverseEnabled === false) {
                if (card.modes.indexOf('reverse') > -1) {
                    card.modes.splice(card.modes.indexOf('reverse'),1);
                }
            }
        }


        if (settings.imagesEnabled) {
            if (card.modes.indexOf('images') === -1) {
                card.modes.push('images');
            }


            if (settings.imagesReadFront === true || settings.imagesReadFront === false) {
                card.imagesReadFront = settings.imagesReadFront;
            }
            if (settings.imagesReadBack === true || settings.imagesReadBack === false) {
                card.imagesReadBack = settings.imagesReadBack;
            }
            if (settings.imagesSpeechRecognition === true || settings.imagesSpeechRecognition === false) {
                card.speechRecognitionImages = settings.imagesSpeechRecognition;
            }


        } else {
            if (settings.imagesEnabled === false) {
                if (card.modes.indexOf('images') > -1) {
                    card.modes.splice(card.modes.indexOf('images'),1);
                }
            }
        }

        card.save(function() {
            deferred.resolve(true);
        });
    });
    return deferred.promise;
};



exports.updateAllCards = function (req, res) {
    var cardsToUpdate = 0;
    var cardsUpdated = 0;

    var checkAllCardsHaveUpdated = function() {
        cardsUpdated++;
        if (cardsUpdated === cardsToUpdate) {
            res.jsonp('ok');
        }
    };

    getPackTree(req.pack.id).then(function(packTree) {
        Pack.find({'_id': { '$in' : packTree} }).exec(function (err, packs) {
            for (var i=0; i< packs.length; i++) {

                if (packs[i].cards) {
                    for (var j = 0; j < packs[i].cards.length; j++) {
                        cardsToUpdate++;
                        updateCard(packs[i].cards[j], req.body).then(checkAllCardsHaveUpdated);
                    }
                }
            }
        });
    });
};

exports.removeDanglingPacks = function (req, res) {


    var checkCourse = function (pack) {
        Course.findOne({'_id': pack.course}).exec(function (err, course) {


            if (!course) {
                removePack(pack);
            }

        });
    };

    Pack.find().exec(function (err, packs) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            //console.log(packs);
            for (var i = 0; i < packs.length; i++) {
                checkCourse(packs[i]);

            }
            res.jsonp('ok');
        }
    });
};

/**
 * List of Packs
 */
exports.list = function (req, res) {
    if (req.query._id) {

        Pack.find({'_id': req.query._id}).exec(function (err, packs) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(packs);
            }
        });
    } else if (req.query.text || req.query.text === '') {
        var search = req.query.text.split(' ');
        Pack.find({'name': {$regex: '^' + search[0]}}).
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
        Pack.find().sort('-created').populate('user', 'displayName').exec(function (err, packs) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(packs);
            }
        });
    }
};

/**
 * Pack middleware
 */
exports.packByID = function (req, res, next, id) {
    //Pack.findById(id).populate('user', 'displayName').populate('course').exec(function (err, pack) {
    Pack.findById(id).populate('user', 'displayName').populate('course').populate('cards').exec(function (err, pack) {
        if (err) return next(err);
        if (!pack) return next(new Error('Failed to load Pack ' + id));
        req.pack = pack;
        next();
    });
};

/**
 * Pack authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.user.roles.indexOf('admin') > -1) {
        next();
    } else if (req.pack.user && (req.pack.user.id !== req.user.id)) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }
};