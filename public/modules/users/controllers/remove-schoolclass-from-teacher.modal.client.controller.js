'use strict';

angular.module('schoolclasses').controller('RemoveSchoolclassFromTeacherModalController', ['$scope', '$state', '$location', '$modalInstance', 'teacher', 'schoolclass','Schools', 'Schoolclasses', 'Authentication',
    function ($scope, $state, $location, $modalInstance, teacher, schoolclass, Schools, Schoolclasses, Authentication) {
        $scope.teacher = teacher;
        $scope.schoolclass = schoolclass;
        $scope.authentication = Authentication;

        $scope.ok = function () {


            for (var i=0; i<teacher.teachesClasses.length; i++) {
                if (teacher.teachesClasses[i] === $scope.schoolclass._id) {
                    teacher.teachesClasses.splice(i, 1);
                }
            }

            teacher.$update(function() {
                $modalInstance.close();
            });


        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);
