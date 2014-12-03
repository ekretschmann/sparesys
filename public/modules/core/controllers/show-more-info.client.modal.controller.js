'use strict';

angular.module('core').controller('ShowMoreInfoController', ['$scope', '$state', '$modalInstance',
    function ($scope, $state, $modalInstance) {
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);