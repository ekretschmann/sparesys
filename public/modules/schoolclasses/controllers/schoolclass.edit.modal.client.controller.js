'use strict';

angular.module('schoolclasses').controller('EditClassController', ['$scope', '$location', '$timeout','$state', '$modalInstance', 'schoolclass', 'school',
    function($scope, $location, $timeout, $state, $modalInstance, schoolclass, school) {

        $scope.schoolclass = schoolclass;
        $scope.school = school;
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