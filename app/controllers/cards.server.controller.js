'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Card = mongoose.model('Card'),
    Pack = mongoose.model('Pack'),
    Course = mongoose.model('Course'),
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
                message = 'Card already exists';
                break;
            default:
                message = 'Something went wrong ' + err;
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message) message = err.errors[errName].message;
        }
    }

    return message;
};

/**
 * Create a Card
 */
exports.create = function (req, res) {


    var card = new Card(req.body);


    if (req.body.userId) {
        card.user = req.body.userId;
    } else {
        card.user = req.user;
    }

    var addCardCopyToSlavePack = function(packId, card) {
        var cardCopy = new Card();

        Pack.findOne({'_id': packId}).exec(function (err, pack) {

            if (!err && pack) {


                cardCopy.packs = [];
                cardCopy.packs.push(packId);

                cardCopy.languageFront = card.languageFront;
                cardCopy.languageBack = card.languageBack;
                cardCopy.speechRecognitionReverse = card.speechRecognitionReverse;
                cardCopy.speechRecognitionForward = card.speechRecognitionForward;
                cardCopy.readBackReverse = card.readBackReverse;
                cardCopy.readFrontReverse = card.readFrontReverse;
                cardCopy.readBackForward = card.readBackForward;
                cardCopy.readFrontForward = card.readFrontForward;
                cardCopy.imagesReadBack = card.imagesReadBack;
                cardCopy.speechRecognitionImages = card.speechRecognitionImages;
                cardCopy.imagesReadFront = card.imagesReadFront;
                cardCopy.modes = card.modes;
                cardCopy.question = card.question;
                cardCopy.answer = card.answer;
                cardCopy.check = card.check;
                cardCopy.questionExtension = card.questionExtension;
                cardCopy.answerExtension = card.answerExtension;
                cardCopy.timedForward = card.timedForward;
                cardCopy.limitForward = card.limitForward;
                cardCopy.timedReverse = card.timedReverse;
                cardCopy.limitReverse = card.limitReverse;
                cardCopy.timedImages = card.timedImages;
                cardCopy.limitImages = card.limitImages;

                cardCopy.save(function() {
                    pack.cards.push(cardCopy._id);
                    pack.save();
                    //card.slaves.push(cardCopy._id);
                    //card.save();
                });
            }
        });
        return cardCopy._id;
    };

    // use course default settings
    Course.findOne({'_id': card.course}).exec(function (err, course) {

        //console.log(course.cardDefaults);
        card.speechRecognitionReverse = course.cardDefaults.reverse.speechRecognition;
        card.speechRecognitionForward = course.cardDefaults.forward.speechRecognition;
        card.readBackReverse = course.cardDefaults.reverse.readBack;
        card.readFrontReverse = course.cardDefaults.reverse.readFront;
        card.readBackForward = course.cardDefaults.forward.readBack;
        card.readFrontForward = course.cardDefaults.forward.readFront;
        card.imagesReadBack = course.cardDefaults.images.readBack;
        card.imagesReadFront = course.cardDefaults.images.readFront;
        card.speechRecognitionImages = course.cardDefaults.images.speechRecognition;
        card.check = course.cardDefaults.checks;
        card.languageFront = course.cardDefaults.languageFront;
        card.languageBack = course.cardDefaults.languageBack;
        card.timedForward = course.cardDefaults.forward.timed;
        card.timedReverse = course.cardDefaults.reverse.timed;
        card.timedImages = course.cardDefaults.images.timed;
        card.limitForward = course.cardDefaults.forward.timeLimit;
        card.limitReverse = course.cardDefaults.reverse.timeLimit;
        card.limitImages = course.cardDefaults.images.timeLimit;
        card.modes = [];
        if (course.cardDefaults.forward.enabled) {
            card.modes.push('forward');
        }
        if (course.cardDefaults.reverse.enabled) {
            card.modes.push('reverse');
        }
        if (course.cardDefaults.images.enabled) {
            card.modes.push('images');
        }



        Pack.findOne({'_id': card.packs[0]}).exec(function (err, pack) {

            pack.cards.push(card._id);
            pack.save();
            var ids = [];
            for(var i=0; i< pack.slaves.length; i++) {
                var id = addCardCopyToSlavePack(pack.slaves[i], card);
                if (ids.indexOf(id) === -1) {
                    ids.push(id);
                }
            }
            card.slaves = ids;
            card.save(function (err, theCard) {
                if (err) {
                    return res.send(400, {
                        message: getErrorMessage(err)
                    });
                } else {
                    res.jsonp(theCard);
                }
            });
        });
    });


};

/**
 * Show the current Card
 */
exports.read = function (req, res) {
    res.jsonp(req.card);
};


/**
 * Update a Card
 */
exports.update = function (req, res) {


    //if (true) {
    //    return res.send(400, {
    //
    //        message: 'test'
    //    });
    //}

    var card = req.card;


    //card.__v = undefined;
    card = _.extend(card, req.body);


    if (!req.body.startDate) {
        card.startDate = undefined;
    }


    if (!req.body.dueDate) {
        card.dueDate = undefined;
    }


    if (!req.body.answer) {
        card.answer = undefined;
    }

    if (!req.body.question) {
        card.question = undefined;
    }

    if (!req.body.questionExtension) {
        card.questionExtension = undefined;
    }

    if (!req.body.answerExtension) {
        card.answerExtension = undefined;
    }

    card.slaves.forEach(function (cid) {


        var findCard = Card.find({'_id': cid}).exec(function (err) {
            if (err) {
                console.log('Error: ' + err);
            }
        });

        findCard.then(function (findCardResult) {
            var c = findCardResult[0];


            c.imagesReadFront = card.imagesReadFront;
            c.speechRecognitionImages = card.speechRecognitionImages;
            c.imagesReadBack = card.imagesReadBack;
            c.languageFront = card.languageFront;
            c.languageBack = card.languageBack;
            c.modes = card.modes;
            c.question = card.question;
            c.answer = card.answer;
            c.readFrontForward = card.readFrontForward;
            c.readBackForward = card.readBackForward;
            c.readFrontReverse = card.readFrontReverse;
            c.readBackReverse = card.readBackReverse;
            c.speechRecognitionForward = card.speechRecognitionForward;
            c.speechRecognitionReverse = card.speechRecognitionReverse;
            c.images = card.images;
            c.check = card.check;
            c.dueDate = card.dueDate;
            c.startDate = card.startDate;
            c.format = card.format;
            c.acceptedAnswersForward = card.acceptedAnswersForward;
            c.alternativeAnswersForward = card.alternativeAnswersForward;
            c.invalidAnswersForward = card.invalidAnswersForward;
            c.acceptedAnswersReverse = card.acceptedAnswersReverse;
            c.invalidAnswersReverse = card.invalidAnswersReverse;
            c.questionExtension = card.questionExtension;
            c.answerExtension = card.answerExtension;
            c.timedForward = card.timedForward;
            c.timedReverse = card.timedReverse;
            c.timedImages = card.timedImages;
            c.limitForward = card.limitForward;
            c.limitReverse = card.limitReverse;
            c.limitImages = card.limitImages;

            //c.question = card.question;
            //c.validanswers = card.validanswers;
            //c.invalidanswers = card.invalidanswers;
            //c.validreverseanswers = card.validreverseanswers;
            //c.invalidreverseanswers = card.invalidreverseanswers;
            //c.answer = card.answer;
            //c.due = card.due;
            //c.after = card.after;
            //c.validation = card.validation;
            //c.images = card.images;
            //c.bothways = card.bothways;
            //c.alternatives = card.alternatives;
            //c.alternativequestions = card.alternativequestions;
            //c.sound = card.sound;
            //c.soundback = card.soundback;
            //c.format = card.format;
            //c.type = card.type;
            c.save();

        });
    });

    //console.log('saving');


    card.save(function (err) {


        if (err) {
            //console.log(err);
            //console.log(card);
            return res.send(400, {

                message: getErrorMessage(err)
            });
            //console.log('error saving card '+card.question);
            //console.log(err);
            //
            //console.log('new version is'+card.__v);
            //
            //
            //Card.find({'_id': card._id}).exec(function (err, c) {
            //    card.__v = c.__v;
            //    card.save(function(err) {
            //        if(err) {
            //            return res.send(400, {
            //                message: getErrorMessage(err)
            //            });
            //        } else {
            //            res.jsonp(card);
            //        }
            //    });
            //});


        } else {
            res.jsonp(card);
        }
    });
};

/**
 * Delete an Card
 */
exports.delete = function (req, res) {

    var card = req.card;

    function deleteCardFromItsPack(card) {


        card.packs.forEach(function (pid) {
            var findPack = Pack.find({'_id': pid}).exec(function (err) {
                if (err) {
                    console.log('Error: ' + err);
                }
            });

            findPack.then(function (findPackResult) {


                for (var i = 0; i < findPackResult[0].cards.length; i++) {
                    if (findPackResult[0].cards[i].toString() === card._id.toString()) {
                        findPackResult[0].cards.splice(i, 1);
                    }


                }
//                console.log('pack is now: ' + findPackResult[0].cards);
                findPackResult[0].save();
            });
        });
    }

    card.slaves.forEach(function (cid) {

        console.log(cid);
        var findCard = Card.find({'_id': cid}).exec(function (err) {
            if (err) {
                console.log('Error: ' + err);
            }
        });

        findCard.then(function (findCardResult) {

            console.log('xxxx');
            console.log(findCardResult);
            deleteCardFromItsPack(findCardResult[0]);

            console.log('removing slave: ' + findCardResult[0]._id);
            findCardResult.remove();
        });
    });


    deleteCardFromItsPack(card);

//    console.log('removing original: ' + card._id);
    card.remove(function (err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(card);
        }
    });
};

/**
 * List of Cards
 */
exports.list = function (req, res) {

    if (req.query._id) {

        Card.find({'_id': req.query._id}).exec(function (err, packs) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(packs);
            }
        });
    } else {

        Card.find().sort('-created').populate('user', 'displayName').exec(function (err, cards) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(cards);
            }
        });
    }
};

/**
 * Card middleware
 */
exports.cardByID = function (req, res, next, id) {
    Card.findById(id).populate('user', 'displayName').exec(function (err, card) {
        if (err) return next(err);
        if (!card) return next(new Error('Failed to load Card ' + id));
        req.card = card;
        next();
    });
};

/**
 * Card authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {

    if (req.user.roles.indexOf('admin') > -1) {
        next();
    } else if (req.card.user && (req.card.user._id !== req.user._id)) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }
};
