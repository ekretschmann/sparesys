'use strict';

angular.module('courses').controller('DeleteMessageModalController', ['$scope', '$location', '$state', '$modalInstance', 'message',
	function($scope, $location, $state, $modalInstance, message) {
        $scope.message = message;

        $scope.ok = function () {
            $scope.message.$remove(function () {
                $state.go($state.$current, null, { reload: true });
            });

            $modalInstance.close();
        };



        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);