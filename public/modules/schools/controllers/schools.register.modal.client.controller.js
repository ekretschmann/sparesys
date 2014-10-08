'use strict';

angular.module('schools').controller('RegisterSchoolController', ['$scope', '$state', '$timeout', '$modalInstance', 'Schools', 'Authentication',
    function ($scope, $state, $timeout, $modalInstance, Schools, Authentication) {

        $scope.school = {};


        $timeout(function () {
            angular.element('.focus').trigger('focus');
        }, 100);

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

                Authentication.user.administersSchools.push(response._id);
//                $state.go('home', null, { reload: true });
                $modalInstance.dismiss('cancel');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };
    }
]);