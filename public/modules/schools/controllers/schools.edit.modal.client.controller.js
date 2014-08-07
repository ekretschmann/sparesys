'use strict';

angular.module('schools').controller('EditSchoolController', ['$scope', '$state', '$timeout', '$modalInstance', 'school',
    function ($scope, $state, $timeout, $modalInstance, school) {
        $scope.school = school;


        $scope.setFocus = function () {
            $timeout(function () {
                angular.element('.editPackFocus').trigger('focus');
            }, 100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {



            $scope.school.$update();




            $modalInstance.dismiss('cancel');
        };
    }
]);