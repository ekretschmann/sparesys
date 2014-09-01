'use strict';

angular.module('schools').controller('UnsubscribeStudentModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {

            for (var i in school.students) {
                if (school.students[i] === $scope.authentication.user._id) {
                    school.students.splice(i, 1);
                }
            }
            school.$update();

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);