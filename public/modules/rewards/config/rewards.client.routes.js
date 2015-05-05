'use strict';

//Setting up route
angular.module('rewards').config(['$stateProvider',
	function($stateProvider) {
		// Rewards state routing
		$stateProvider.
		state('manageRewards', {
			url: '/rewards/manage',
			templateUrl: 'modules/rewards/views/manage-rewards.client.view.html'
		}).state('manageReward', {
				url: '/rewards/manage/:rewardId',
				templateUrl: 'modules/rewards/views/manage-rewards.client.view.html'
			});
	}
]);