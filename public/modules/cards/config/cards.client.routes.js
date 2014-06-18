'use strict';

//Setting up route
angular.module('cards').config(['$stateProvider',
	function($stateProvider) {
		// Cards state routing
		$stateProvider.
		state('editCard', {
			url: '/cards/:cardId/edit',
			templateUrl: 'modules/cards/views/edit-card.client.view.html'
		});
	}
]);