'use strict';

//Setting up route
angular.module('messages').config(['$stateProvider',
    function ($stateProvider) {
        // Messages state routing
        $stateProvider.
            state('adminMessages', {
                url: '/messages/admin',
                templateUrl: 'modules/messages/views/admin-messages.client.view.html'
            })
            .
            state('manageMessages', {
                url: '/messages/manage-suggestions',
                templateUrl: 'modules/messages/views/manage-suggestions.client.view.html'
            })
            //.
//            state('createMessage', {
//                url: '/messages/create',
//                templateUrl: 'modules/messages/views/create-message.client.view.html'
//            }).
//            state('viewMessage', {
//                url: '/messages/:messageId',
//                templateUrl: 'modules/messages/views/view-message.client.view.html'
//            }).
//            state('editMessage', {
//                url: '/messages/:messageId/edit',
//                templateUrl: 'modules/messages/views/edit-message.client.view.html'
//            })
        ;
    }
]);