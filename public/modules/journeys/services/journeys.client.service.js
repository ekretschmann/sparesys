'use strict';

//Journeys service used to communicate Journeys REST endpoints
angular.module('journeys').factory('Journeys', ['$resource',
	function($resource) {
		return $resource('journeys/:journeyId', { journeyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);