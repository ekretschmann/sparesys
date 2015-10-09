'use strict';

//Setting up route
angular.module('schools').config(['$stateProvider',
    function ($stateProvider) {
        // Schools state routing
        $stateProvider.
            state('subscribeStudent', {
                url: '/schools/subscribe',
                templateUrl: 'modules/schools/views/subscribe-student.client.view.html'
            }).state('manageSchools', {
                url: '/schools/manage',
                templateUrl: 'modules/schools/views/manage-schools.client.view.html'
            }).
            state('adminSchools', {
                url: '/schools/admin',
                templateUrl: 'modules/schools/views/admin-schools.client.view.html',
                data: { auth: ['admin']}
            }).
            state('registerSchool', {
                url: '/schools/register',
                templateUrl: '../views/partial/register-school.client.view.html'
            }).
            state('viewSchool', {
                url: '/schools/:schoolId',
                templateUrl: 'modules/schools/views/view-school.client.view.html'
            }).
            state('adminSchool', {
                url: '/schools/:schoolId/admin',
                templateUrl: 'modules/schools/views/admin-school.client.view.html',
                data: { auth: 'admin'}
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