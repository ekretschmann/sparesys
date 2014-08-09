'use strict';

angular.module('schools').controller('SubscribeStudentModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {

                if (school.students.indexOf($scope.authentication.user._id) === -1) {
                    school.students.push($scope.authentication.user._id);
                    school.$update();
                } else {
                    for (var i in school.teachers) {
                        if (school.students[i] === $scope.authentication.user._id) {
                            school.students.splice(i, 1);
                        }
                    }
                    school.$update();
                }

//            school.$remove(school, function () {
//
//                $location.path('schools/manage');
//            });

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);