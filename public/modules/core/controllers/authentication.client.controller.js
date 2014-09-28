'use strict';

angular.module('core').controller('AuthenticationController', ['$scope', 'Authentication',
    function ($scope,  Authentication) {
        $scope.authentication = Authentication;


    }]);