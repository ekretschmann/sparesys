'use strict';

//Courses service used to communicate Courses REST endpoints
angular.module('core').factory('Globals', ['$resource', function ($resource) {


    return $resource('globals/:globalId', {
        globalId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);