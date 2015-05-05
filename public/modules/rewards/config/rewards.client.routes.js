'use strict';

//Setting up route
angular.module('rewards').config(['$stateProvider',
	function($stateProvider) {
		// Rewards state routing
		$stateProvider.
		state('manageReward', {
			url: '/rewards/manage',
			templateUrl: 'modules/rewards/views/manage-rewards.client.view.html'
		});
	}
]);