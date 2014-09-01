'use strict';

//Setting up route
angular.module('packs').config(['$stateProvider',
    function ($stateProvider) {
        // Packs state routing
        $stateProvider.
            state('adminPacks', {
                url: '/packs/admin',
                templateUrl: 'modules/packs/views/admin-packs.client.view.html'
            }).
            state('editPack', {
                url: '/packs/:packId/edit',
                templateUrl: 'modules/packs/views/edit-pack.client.view.html'
            }).
            state('viewPack', {
                url: '/packs/:packId/view',
                templateUrl: 'modules/packs/views/view-pack.client.view.html'
            });

//		state('listPacks', {
//			url: '/packs',
//			templateUrl: 'modules/packs/views/list-packs.client.view.html'
//		}).
//		state('createPack', {
//			url: '/packs/create',
//			templateUrl: 'modules/packs/views/create-pack.client.view.html'
//		}).
//		state('viewPack', {
//			url: '/packs/:packId',
//			templateUrl: 'modules/packs/views/view-pack.client.view.html'
//		}).
//		state('editPack', {
//			url: '/packs/:packId/edit',
//			templateUrl: 'modules/packs/views/edit-pack.client.view.html'
//		});
    }
]);