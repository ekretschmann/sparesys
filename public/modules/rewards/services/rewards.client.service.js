'use strict';

//Rewards service used to communicate Rewards REST endpoints
angular.module('rewards').factory('Rewards', ['$resource',
	function($resource) {
		return $resource('rewards/:rewardId', { rewardId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);