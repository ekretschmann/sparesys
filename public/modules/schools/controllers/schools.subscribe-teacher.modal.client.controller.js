'use strict';

angular.module('schools').controller('SubscribeTeacherModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school',
    function ($scope, $location, $modalInstance, Authentication, school) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {

                if (school.teachers.indexOf($scope.authentication.user._id) === -1) {
                    school.teachers.push($scope.authentication.user._id);
                    school.$update();
                } else {
                    for (var i in school.teachers) {
                        if (school.teachers[i] === $scope.authentication.user._id) {
                            school.teachers.splice(i, 1);
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