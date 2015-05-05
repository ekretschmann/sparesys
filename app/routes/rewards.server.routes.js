'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var rewards = require('../../app/controllers/rewards.server.controller');

	// Rewards Routes
	app.route('/rewards')
		.get(rewards.list)
		.post(users.requiresLogin, rewards.create);

	app.route('/rewards/:rewardId')
		.get(rewards.read)
		.put(users.requiresLogin, rewards.hasAuthorization, rewards.update)
		.delete(users.requiresLogin, rewards.hasAuthorization, rewards.delete);

	// Finish by binding the Reward middleware
	app.param('rewardId', rewards.rewardByID);
};
