'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
    function ($stateProvider) {
        // Users state routing
        $stateProvider.
            state('listUsers', {
                url: '/users',
                templateUrl: 'modules/users/views/admin-users.client.view.html',
                data: { auth: ['admin']}
            }).
            state('editUser', {
                url: '/users/:userId/edit',
                templateUrl: 'modules/users/views/edit-user.client.view.html',
                data: { auth: ['admin']}
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
                templateUrl: '../views/partial/signup.client.view.html'
            }).
            state('signin', {
                url: '/signin',
                templateUrl: '../views/partial/signin.client.view.html'
            });
    }
]);

angular.module('users').run(function ($rootScope, Authentication, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if ( toState.data && toState.data.auth && toState.data.auth.indexOf('admin') > -1 && Authentication.user && Authentication.user.roles.indexOf('admin') === -1 ) {
            event.preventDefault();
            $state.current.url = '/';
            $state.go($state.current);
            return false;
        }
    });
});