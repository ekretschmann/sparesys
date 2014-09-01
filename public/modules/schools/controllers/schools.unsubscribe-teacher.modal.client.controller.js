'use strict';

angular.module('schools').controller('UnsubscribeTeacherModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {


            for (var i in school.teachers) {
                if (school.teachers[i] === $scope.authentication.user._id) {
                    school.teachers.splice(i, 1);
                }
            }
            school.$update();
            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
])
;