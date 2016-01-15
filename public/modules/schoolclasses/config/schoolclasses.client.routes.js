'use strict';

//Setting up route
angular.module('schoolclasses').config(['$stateProvider',
    function ($stateProvider) {

        // Schoolclasses state routing
        $stateProvider.
            state('adminSchoolclasses', {
                url: '/schoolclasses/admin',
                templateUrl: 'modules/schoolclasses/views/admin-schoolclasses.client.view.html',
                data: { auth: ['admin']}
            }).
            state('adminSchoolclass', {
                url: '/schoolclasses/:schoolclassId/admin',
                templateUrl: 'modules/schoolclasses/views/admin-schoolclass.client.view.html',
                data: { auth: ['admin']}
            }).
            state('classProgressForCourse', {
                url: '/schoolclasses/:schoolclassId/course/:courseId/progress',
                templateUrl: 'modules/schoolclasses/views/course-progress.client.view.html'
            }).
            state('viewSchoolclass', {
                url: '/schoolclasses/:schoolclassId',
                templateUrl: 'modules/schoolclasses/views/view-schoolclass.client.view.html'
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