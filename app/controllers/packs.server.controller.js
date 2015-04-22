'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Pack = mongoose.model('Pack'),
    Course = mongoose.model('Course'),
    Card = mongoose.model('Card'),
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

var removePack = function(pack) {
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
        }
    });


};

/**
 * Delete a Pack
 */
exports.delete = function (req, res) {
    var pack = req.pack;


    pack.slaves.forEach(function (slaveId) {
        Pack.findOne({'_id': slaveId}).exec(function (err, p) {
            removePack(p);
        });
    });

    removePack(pack);

    res.jsonp('ok');
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