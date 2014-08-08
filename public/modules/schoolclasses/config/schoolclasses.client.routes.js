'use strict';

//Setting up route
angular.module('schoolclasses').config(['$stateProvider',
    function ($stateProvider) {

        // Schoolclasses state routing
        $stateProvider.
            state('listSchoolclasses', {
                url: '/schoolclasses',
                templateUrl: 'modules/schoolclasses/views/list-schoolclasses.client.view.html'
            }).state('manageClasses', {
                url: '/schools/classes/manage',
                templateUrl: 'modules/schoolclasses/views/manage-schoolclasses.client.view.html'
            }).
            state('createSchoolclass', {
                url: '/schoolclasses/create',
                templateUrl: 'modules/schoolclasses/views/create-schoolclass.client.view.html'
            }).
            state('adminSchoolclass', {
                url: '/schoolclasses/admin',
                templateUrl: 'modules/schoolclasses/views/admin-schoolclasses.client.view.html'
            }).
            state('viewSchoolclass', {
                url: '/schoolclasses/:schoolclassId',
                templateUrl: 'modules/schoolclasses/views/view-schoolclass.client.view.html'
            }).
            state('editSchoolclass', {
                url: '/schoolclasses/:schoolclassId/edit',
                templateUrl: 'modules/schoolclasses/views/edit-schoolclass.client.view.html'
            }).
            state('teachSchoolclass', {
                url: '/schoolclasses/:schoolclassId/teach',
                templateUrl: 'modules/schoolclasses/views/teach-schoolclass.client.view.html'
            });
    }
]);