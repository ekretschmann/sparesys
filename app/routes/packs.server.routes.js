'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var packs = require('../../app/controllers/packs');

	// Packs Routes
	app.route('/packs')
		.get(users.requiresLogin, packs.list)
		.post(users.requiresLogin, packs.create);


	app.route('/packs/removeDanglingPacks')
		.get(users.requiresLogin, users.hasAuthorization, packs.removeDanglingPacks);

	app.route('/packs/removeDeadCards')
		.get(users.requiresLogin, users.hasAuthorization, packs.removeDeadCards);

	app.route('/packs/removeDeadSlaves')
		.get(users.requiresLogin, users.hasAuthorization, packs.removeDeadSlaves);

	app.route('/packs/:packId')
		.get(packs.read)
		.put(users.requiresLogin, packs.update)
	    .delete(users.requiresLogin,  packs.delete);

	app.route('/packs/:packId/update-all-cards')
		.post(packs.updateAllCards, users.requiresLogin);

	// Finish by binding the Pack middleware
	app.param('packId', packs.packByID);
};