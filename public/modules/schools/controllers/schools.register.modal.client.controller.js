'use strict';

angular.module('schools').controller('RegisterSchoolController', ['$scope', '$state', '$timeout', '$modalInstance', 'Schools',
    function ($scope, $state, $timeout, $modalInstance, Schools) {

        $scope.school = {};

        $scope.setFocus = function () {
            $timeout(function () {
                angular.element('.focus').trigger('focus');
            }, 100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.registerSchool = function () {
            // Create new School object
            var newSchool = new Schools({
                name: $scope.school.name,
                city: $scope.school.city,
                country: $scope.school.country
            });

            // Redirect after save
            newSchool.$save(function (response) {

                $modalInstance.dismiss('cancel');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };
    }
]);