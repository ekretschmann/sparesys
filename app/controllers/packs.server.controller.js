'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Pack = mongoose.model('Pack'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
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
exports.create = function(req, res) {
	var pack = new Pack(req.body);
	pack.user = req.user;

	pack.save(function(err) {
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
exports.read = function(req, res) {
	res.jsonp(req.pack);
};

/**
 * Update a Pack
 */
exports.update = function(req, res) {
	var pack = req.pack;

	pack = _.extend(pack, req.body);

	pack.save(function(err) {
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
 * Delete an Pack
 */
exports.delete = function(req, res) {
	var pack = req.pack;

	pack.remove(function(err) {
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
 * List of Packs
 */
exports.list = function(req, res) {
	Pack.find().sort('-created').populate('user', 'displayName').exec(function(err, packs) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(packs);
		}
	});
};

/**
 * Pack middleware
 */
exports.packByID = function(req, res, next, id) {
	Pack.findById(id).populate('user', 'displayName').exec(function(err, pack) {
		if (err) return next(err);
		if (!pack) return next(new Error('Failed to load Pack ' + id));
		req.pack = pack;
		next();
	});
};

/**
 * Pack authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.user.roles.indexOf('admin') > -1) {
        next();
    } else if (req.pack.user && (req.pack.user.id !== req.user.id)) {
        return res.send(403, 'User is not authorized');
    } else {
        next();
    }
};