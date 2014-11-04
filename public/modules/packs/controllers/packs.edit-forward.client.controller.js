'use strict';

angular.module('packs').controller('EditPackForwardController', ['$scope',
    function ($scope) {

        $scope.options = {};

        $scope.options.readFront = 'leave';
        $scope.options.readBack = 'leave';
        $scope.options.mode = 'leave';
        $scope.options.speech = 'leave';

    }
]);