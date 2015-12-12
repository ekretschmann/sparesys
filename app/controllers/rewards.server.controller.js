'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Reward = mongoose.model('Reward'),
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
                message = 'Reward already exists';
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
 * Create a Reward
 */
exports.create = function (req, res) {


    var reward = new Reward(req.body);
    reward.user = req.user;

    console.log(reward);

    reward.save(function (err) {
        console.log(err);
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(reward);
        }
    });
};

/**
 * Show the current Reward
 */
exports.read = function (req, res) {
    res.jsonp(req.reward);
};

/**
 * Update a Reward
 */
exports.update = function (req, res) {
    var reward = req.reward;

    reward = _.extend(reward, req.body);

    reward.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(reward);
        }
    });
};

/**
 * Delete an Reward
 */
exports.delete = function (req, res) {
    var reward = req.reward;

    reward.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(reward);
        }
    });
};

/**
 * List of Rewards
 */
exports.list = function (req, res) {

    if (req.query && req.query.text !== undefined) {
        //var search = req.query.text.split(' ');
        var search = req.query.text;
        Reward.find({'name': {$regex: new RegExp(search, 'i')}}).populate('enables').populate('goals').limit(25).exec(function (err, rewards) {
            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(rewards);
            }
        });
    } else {
        Reward.find().sort('-created').populate('user', 'displayName').exec(function (err, rewards) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(rewards);
            }
        });
    }
};

/**
 * Reward middleware
 */
exports.rewardByID = function (req, res, next, id) {
    Reward.findById(id).populate('user', 'displayName').exec(function (err, reward) {
        if (err) return next(err);
        if (!reward) return next(new Error('Failed to load Reward ' + id));
        req.reward = reward;
        next();
    });
};

/**
 * Reward authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    //if (req.reward.user.id !== req.user.id) {
    //	return res.status(403).send('User is not authorized');
    //}
    //next();
    if (req.user.roles.indexOf('admin') === -1) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }

};
