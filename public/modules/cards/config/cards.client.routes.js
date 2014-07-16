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
            });
    }
]);