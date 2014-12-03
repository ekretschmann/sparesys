'use strict';

angular.module('core').controller('ShowMoreInfoController', ['$scope', '$state', '$modalInstance', 'file',
    function ($scope, $state, $modalInstance, file) {
        $scope.file = '/modules/core/views/info/'+file;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);