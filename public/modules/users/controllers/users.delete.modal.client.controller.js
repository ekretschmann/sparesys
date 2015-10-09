'use strict';

angular.module('courses').controller('DeleteUserModalController', ['$scope', '$location', '$state', '$modalInstance', 'user', 'Users',
	function($scope, $location, $state, $modalInstance, user, Users) {
        $scope.user = user;

        $scope.ok = function () {

            user.$remove();

            $modalInstance.close();

        };



        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);