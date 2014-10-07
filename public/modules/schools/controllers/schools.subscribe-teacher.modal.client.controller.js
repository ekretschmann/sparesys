'use strict';

angular.module('schools').controller('SubscribeTeacherModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {
            school.teachers.push($scope.authentication.user._id);
            school.$update();
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);