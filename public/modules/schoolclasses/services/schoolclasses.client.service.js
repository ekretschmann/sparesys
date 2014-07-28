'use strict';

//Schoolclasses service used to communicate Schoolclasses REST endpoints
angular.module('schoolclasses').factory('Schoolclasses', ['$resource',
	function($resource) {
		return $resource('schoolclasses/:schoolclassId', { schoolclassId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);