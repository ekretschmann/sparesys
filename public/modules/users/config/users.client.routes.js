'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('listUsers', {
                url: '/users',
                templateUrl: 'modules/users/views/list-users.client.view.html'
            }).
            state('editUser', {
                url: '/users/:userId/edit',
                templateUrl: 'modules/users/views/edit-user.client.view.html'
            }).
            state('profile', {
                url: '/settings/profile',
                templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
            }).
            state('password', {
                url: '/settings/password',
                templateUrl: 'modules/users/views/settings/change-password.client.view.html'
            }).
            state('accounts', {
                url: '/settings/accounts',
                templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
            }).
            state('signup', {
                url: '/signup',
                templateUrl: 'modules/users/views/signup.client.view.html'
            }).
            state('signin', {
                url: '/signin',
                templateUrl: '../views/partial/signin.client.view.html'
            });
    }
]);