'use strict';

//Setting up route
angular.module('schools').config(['$stateProvider',
    function ($stateProvider) {
        // Schools state routing
        $stateProvider.
            state('subscribeTeacher', {
                url: '/schools/subscribe/teacher',
                templateUrl: 'modules/schools/views/subscribe-teacher.client.view.html'
            }).
            state('subscribeStudent', {
                url: '/schools/subscribe/student',
                templateUrl: 'modules/schools/views/subscribe-student.client.view.html'
            }).state('manageSchools', {
                url: '/schools/manage',
                templateUrl: 'modules/schools/views/manage-schools.client.view.html'
            }).
            state('adminSchools', {
                url: '/schools/admin',
                templateUrl: 'modules/schools/views/admin-schools.client.view.html'
            }).
            state('registerSchool', {
                url: '/schools/register',
                templateUrl: '../views/partial/register-school.client.view.html'
            }).
            state('viewSchool', {
                url: '/schools/:schoolId',
                templateUrl: 'modules/schools/views/view-school.client.view.html'
            }).
            state('editSchool', {
                url: '/schools/:schoolId/edit',
                templateUrl: 'modules/schools/views/edit-school.client.view.html'
            });
    }
]);