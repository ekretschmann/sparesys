'use strict';

//Setting up route
angular.module('schoolclasses').config(['$stateProvider',
    function ($stateProvider) {

        // Schoolclasses state routing
        $stateProvider.
            state('adminSchoolclass', {
                url: '/schoolclasses/admin',
                templateUrl: 'modules/schoolclasses/views/admin-schoolclasses.client.view.html',
                data: { auth: ['admin']}
            });
    }
]);

angular.module('schoolclasses').run(function ($rootScope, Authentication, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if ( toState.data && toState.data.auth && toState.data.auth.indexOf('admin') > -1 && Authentication.user && Authentication.user.roles.indexOf('admin') === -1 ) {
            event.preventDefault();
            $state.current.url = '/';
            $state.go($state.current);
            return false;
        }
    });
});