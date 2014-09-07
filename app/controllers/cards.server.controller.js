'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Card = mongoose.model('Card'),
    Pack = mongoose.model('Pack'),
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
 * Create a Card
 */
exports.create = function (req, res) {
    var card = new Card(req.body);

    card.user = req.user;

    if (req.query.userId) {
        console.log('for other user');
        card.user = req.query.userId;
    }

    card.save(function (err) {
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
 * Show the current Card
 */
exports.read = function (req, res) {
    res.jsonp(req.card);
};


/**
 * Update a Card
 */
exports.update = function (req, res) {
    var card = req.card;


    card = _.extend(card, req.body);

    if (!req.body.answer) {
        card.answer = undefined;
    }

    if (!req.body.question) {
        card.question = undefined;
    }

    card.slaves.forEach(function (cid) {



        var findCard = Card.find({'_id': cid}).exec(function (err) {
            if (err) {
                console.log('Error: ' + err);
            }
        });

        findCard.then(function (findCardResult) {
            var c = findCardResult[0];
            //c = _.extend(c, req.body);

            c.question = card.question;
            c.answer = card.answer;
            c.due = card.due;
            c.after = card.after;
            c.validation = card.validation;
            c.images = card.images;
            c.bothways = card.bothways;
            c.alternatives = card.alternatives;
            c.alternativequestions = card.alternativequestions;
            c.sound = card.sound;
            c.save();

        });
    });

    card.save(function (err) {
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

        var findCard = Card.find({'_id': cid}).exec(function (err) {
            if (err) {
                console.log('Error: ' + err);
            }
        });

        findCard.then(function (findCardResult) {

            deleteCardFromItsPack(findCardResult[0]);

//            console.log('removing slave: ' + findCardResult[0]._id);
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
    } else if (req.card.user && (req.card.user.id !== req.user.id)) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }
};