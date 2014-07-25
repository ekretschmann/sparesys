'use strict';

//Setting up route
angular.module('schools').config(['$stateProvider',
    function ($stateProvider) {
        // Schools state routing
        $stateProvider.
            state('listSchools', {
                url: '/schools',
                templateUrl: 'modules/schools/views/list-schools.client.view.html'
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
                templateUrl: 'modules/schools/views/register-school.client.view.html'
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