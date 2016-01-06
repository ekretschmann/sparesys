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
   // reward = _.extend(reward, req.body);


    var goals = [];
    for (var i=0; i<req.body.goals.length; i++) {
        if (req.body.goals[i]._id) {
            goals.push(req.body.goals[i]._id);
        } else {
            goals.push(req.body.goals[i]);
        }
    }


    var enables = [];
    for (i=0; i<req.body.enables.length; i++) {
        if (req.body.enables[i]._id) {
            enables.push(req.body.enables[i]._id);
        } else {
            enables.push(req.body.enables[i]);
        }
        //console.log(req.body.enables[i]);
    }
    req.body.goals = goals;
    req.body.enables = enables;
    reward = _.extend(reward, req.body);



    //reward.goals = goals;
    //reward.enables = enables;



    //Reward.findById(reward._id).exec(function (err, r) {
    //    console.log(r.goals);
    //    r = _.extend(reward, req.body);
    //    console.log(r.goals);
    //    if (err) {
    //        return res.status(400).send({
    //            message: getErrorMessage(err)
    //        });
    //    } else {
    //        res.jsonp(r);
    //    }
    //});


    //console.log(reward.goals);
    //console.log(reward.enables);

    reward.save(function (err, theReward) {


        console.log(err);
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            Reward.findById(theReward._id).populate('enables').populate('goals').exec(function (err, r) {
                res.jsonp(r);
            });

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
        Reward.find().sort('-created').populate('enables').populate('goals').populate('user', 'displayName').exec(function (err, rewards) {
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
