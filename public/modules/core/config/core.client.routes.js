'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {

        // Redirect to home view when route not found

        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.

            state('practice', {
                url: '/practice/:courseId',
                templateUrl: 'modules/core/views/practice.client.view.html'
            }).state('home', {
                url: '/',
                templateUrl: 'modules/core/views/home.client.view.html'
            });
    }
]);


angular.module('core').run(function($window, $rootScope) {
    $rootScope.online = navigator.onLine;

    $window.addEventListener('offline', function () {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener('online', function () {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);

});
