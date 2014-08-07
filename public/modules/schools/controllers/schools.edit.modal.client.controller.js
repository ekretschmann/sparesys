'use strict';

angular.module('schools').controller('EditSchoolController', ['$scope', '$state', '$timeout', '$modalInstance', 'school',
    function ($scope, $state, $timeout, $modalInstance, school) {
        $scope.school = school;

        $scope.model = {};

        $scope.setFocus = function () {
            $timeout(function () {
                angular.element('.focus').trigger('focus');
            }, 100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {

            $scope.school.name = $scope.model.name;
            $scope.school.city = $scope.model.city;
            $scope.school.country = $scope.model.country;

            $scope.school.$update();

            $modalInstance.dismiss('cancel');
        };
    }
]);