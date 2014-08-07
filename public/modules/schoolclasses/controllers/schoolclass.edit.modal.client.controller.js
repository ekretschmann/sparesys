'use strict';

angular.module('schoolclasses').controller('EditClassController', ['$scope', '$location', '$timeout','$state', '$modalInstance', 'schoolclass',
    function($scope, $location, $timeout, $state, $modalInstance, schoolclass) {

        $scope.schoolclass = schoolclass;
        $scope.name = {};


        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.focus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {

            $scope.schoolclass.name = $scope.name.text;


            $scope.schoolclass.$update();
            $modalInstance.dismiss('cancel');
        };
	}
]);