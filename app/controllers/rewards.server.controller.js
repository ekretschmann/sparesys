'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Reward = mongoose.model('Reward'),
	_ = require('lodash');

/**
 * Create a Reward
 */
exports.create = function(req, res) {
	var reward = new Reward(req.body);
	reward.user = req.user;

	reward.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reward);
		}
	});
};

/**
 * Show the current Reward
 */
exports.read = function(req, res) {
	res.jsonp(req.reward);
};

/**
 * Update a Reward
 */
exports.update = function(req, res) {
	var reward = req.reward ;

	reward = _.extend(reward , req.body);

	reward.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reward);
		}
	});
};

/**
 * Delete an Reward
 */
exports.delete = function(req, res) {
	var reward = req.reward ;

	reward.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(reward);
		}
	});
};

/**
 * List of Rewards
 */
exports.list = function(req, res) { 
	Reward.find().sort('-created').populate('user', 'displayName').exec(function(err, rewards) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(rewards);
		}
	});
};

/**
 * Reward middleware
 */
exports.rewardByID = function(req, res, next, id) { 
	Reward.findById(id).populate('user', 'displayName').exec(function(err, reward) {
		if (err) return next(err);
		if (! reward) return next(new Error('Failed to load Reward ' + id));
		req.reward = reward ;
		next();
	});
};

/**
 * Reward authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.reward.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
