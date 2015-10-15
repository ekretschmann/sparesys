'use strict';

//Setting up route
angular.module('roles').config(['$stateProvider',
	function($stateProvider) {
		// Roles state routing
		$stateProvider.
		state('adminRoles', {
			url: '/roles',
			templateUrl: 'modules/roles/views/admin-roles.client.view.html'
		});
	}
]);