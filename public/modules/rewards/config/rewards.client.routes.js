'use strict';

//Setting up route
angular.module('rewards').config(['$stateProvider',
	function($stateProvider) {
		// Rewards state routing
		$stateProvider.
		state('listRewards', {
			url: '/rewards',
			templateUrl: 'modules/rewards/views/list-rewards.client.view.html'
		}).
		state('createReward', {
			url: '/rewards/create',
			templateUrl: 'modules/rewards/views/create-reward.client.view.html'
		}).
		state('viewReward', {
			url: '/rewards/:rewardId',
			templateUrl: 'modules/rewards/views/view-reward.client.view.html'
		}).
		state('editReward', {
			url: '/rewards/:rewardId/edit',
			templateUrl: 'modules/rewards/views/edit-reward.client.view.html'
		});
	}
]);