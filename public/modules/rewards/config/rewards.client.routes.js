'use strict';

//Setting up route
angular.module('rewards').config(['$stateProvider',
	function($stateProvider) {
		// Rewards state routing
		$stateProvider.
		state('adminRewards', {
			url: '/rewards/admin',
			templateUrl: 'modules/rewards/views/admin-rewards.client.view.html'
		});
	}
]);