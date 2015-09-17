'use strict';

//Setting up route
angular.module('courses').config(['$stateProvider',
    function ($stateProvider) {
        // Courses state routing
        $stateProvider.
            state('listCourses', {
                url: '/courses',
                templateUrl: 'modules/courses/views/list-courses.client.view.html'
            }).
            state('adminCourses', {
                url: '/courses/admin',
                templateUrl: 'modules/courses/views/admin-courses.client.view.html',
                data: { auth: ['admin']}
            }).
            state('adminCourse', {
                url: '/courses/:courseId/admin',
                templateUrl: 'modules/courses/views/admin-course.client.view.html',
                data: { auth: ['admin']}
            }).
            state('createCourse', {
                url: '/courses/create',
                templateUrl: 'modules/courses/views/create-course.client.view.html'
            }).
            state('editCourseNew', {
                url: '/courses/:courseId/edit',
                templateUrl: 'modules/courses/views/edit-course-new.client.view.html'
            }).
            state('editCards', {
                url: '/courses/:courseId/cards',
                templateUrl: 'modules/courses/views/edit-all-cards-new.client.view.html'
            }).
            state('editCourse', {
                url: '/courses/:courseId/edit',
                templateUrl: 'modules/courses/views/edit-course.client.view.html'
            }).
            state('courseStats', {
                url: '/courses/:courseId/stats',
                templateUrl: 'modules/courses/views/course-stats.client.view.html'
            }).
            state('viewCourse', {
                url: '/courses/:courseId/view',
                templateUrl: 'modules/courses/views/view-course.client.view.html'
            }).
            state('searchCourse', {
                url: '/courses/search',
                templateUrl: 'modules/courses/views/search-courses.client.view.html'
            }).state('uploadCourses', {
                url: '/courses/upload',
                templateUrl: 'modules/courses/views/upload-course.client.view.html'
            });
    }
]);

angular.module('courses').run(function ($rootScope, Authentication, $state) {
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if ( toState.data && toState.data.auth && toState.data.auth.indexOf('admin') > -1 && Authentication.user && Authentication.user.roles.indexOf('admin') === -1 ) {
            event.preventDefault();
            $state.current.url = '/';
            $state.go($state.current);
            return false;
        }
    });
});