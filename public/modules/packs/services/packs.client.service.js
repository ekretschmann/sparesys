'use strict';

//Packs service used to communicate Packs REST endpoints
angular.module('packs').factory('Packs', ['$resource', function($resource) {
    return $resource('packs/:packId', {
        packId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);