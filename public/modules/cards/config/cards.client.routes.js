'use strict';

//Setting up route
angular.module('cards').config(['$stateProvider',
    function ($stateProvider) {
        // Cards state routing
        $stateProvider.
            state('adminCards', {
                url: '/cards/admin',
                templateUrl: 'modules/cards/views/admin-cards.client.view.html'
            }).
            state('editCard', {
                url: '/cards/:cardId/edit',
                templateUrl: 'modules/cards/views/edit-card.client.view.html'
            }).
            state('editCardNew', {
                url: '/cards/:cardId',
                templateUrl: 'modules/cards/views/edit-card-new.client.view.html'
            }).
            state('adminCard', {
                url: '/cards/:cardId/admin',
                templateUrl: 'modules/cards/views/admin-card.client.view.html'
            }).
            state('editCardOnTab', {
                url: '/cards/:cardId/tab/:tab/edit',
                templateUrl: 'modules/cards/views/edit-card.client.view.html'
            });
    }
]);