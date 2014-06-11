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
                templateUrl: 'modules/courses/views/admin-courses.client.view.html'
            }).
            state('createCourse', {
                url: '/courses/create',
                templateUrl: 'modules/courses/views/create-course.client.view.html'
            }).
            state('editCourse', {
                url: '/courses/:courseId/edit',
                templateUrl: 'modules/courses/views/edit-course.client.view.html'
            });
    }
]);