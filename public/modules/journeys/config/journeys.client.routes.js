'use strict';

//Setting up route
angular.module('journeys').config(['$stateProvider',
	function($stateProvider) {
		// Journeys state routing
		$stateProvider.
		state('listJourneys', {
			url: '/journeys',
			templateUrl: 'modules/journeys/views/list-journeys.client.view.html'
		}).
		state('createJourney', {
			url: '/journeys/create',
			templateUrl: 'modules/journeys/views/create-journey.client.view.html'
		}).
		state('viewJourney', {
			url: '/journeys/:journeyId',
			templateUrl: 'modules/journeys/views/view-journey.client.view.html'
		}).
		state('editJourney', {
			url: '/journeys/:journeyId/edit',
			templateUrl: 'modules/journeys/views/edit-journey.client.view.html'
		});
	}
]);