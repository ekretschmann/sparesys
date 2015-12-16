'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Global = mongoose.model('Global'),
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

    var global = new Global(req.body);

    global.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(global);
        }
    });
};

/**
 * Show the current Reward
 */
exports.read = function (req, res) {
    res.jsonp(req.global);
};

/**
 * Update a Reward
 */
exports.update = function (req, res) {


    var global = req.global;
    global = _.extend(global, req.body);




    global.save(function (err) {


        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(global);
        }
    });
};

/**
 * Delete an Reward
 */
exports.delete = function (req, res) {
    var reward = req.reward;

    global.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(global);
        }
    });
};

/**
 * List of Rewards
 */
exports.list = function (req, res) {

    Global.find().sort('-created').populate('user', 'displayName').exec(

        function(err, globals) {

            if (req.query.to) {

                Global.find().exec(function (err, globals) {
                    if (err) {
                        return res.send(400, {
                            message: getErrorMessage(err)
                        });
                    } else {
                        res.jsonp(globals);
                    }
                });


            } else

            if (err) {
                return res.send(400, {
                    message: getErrorMessage(err)
                });
            } else {
                res.jsonp(globals);
            }
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
