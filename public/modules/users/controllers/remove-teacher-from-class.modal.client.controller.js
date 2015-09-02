'use strict';

angular.module('schools').controller('RemoveTeacherFromClassModalController', ['$scope', '$state', '$location', '$modalInstance', 'schoolclass', 'teacher', 'schoolclass', 'Schools', 'Schoolclasses', 'Authentication',
    function ($scope, $state, $location, $modalInstance, schoolId, teacher, schoolclass, Schools, Schoolclasses, Authentication) {
        $scope.classId = schoolclass;
        $scope.teacher = teacher;

        $scope.ok = function () {


            console.log($scope.classId);
            console.log($scope.teacher);

            for (var i=0; i<=teacher.teachesClasses.length; i++) {
                if (teacher.teachesClasses[i] === $scope.classId) {
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
