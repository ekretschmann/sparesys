'use strict';

angular.module('schools').controller('SubscribeToSchoolModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school', 'unsubscribeTeacher', 'unsubscribeStudent',
	function($scope, $location, $modalInstance, Authentication, school, unsubscribeTeacher, unsubscribeStudent) {

        $scope.authentication = Authentication;
        $scope.school = school;
        $scope.unsubscribeTeacher = unsubscribeTeacher;
        $scope.unsubscribeStudent = unsubscribeStudent;
        $scope.options = {asTeacher: $scope.authentication.user.roles.indexOf('teacher') > -1,
            asStudent: $scope.authentication.user.roles.indexOf('teacher') === -1};

        $scope.ok = function () {


            if ($scope.unsubscribeTeacher) {
                for (var i in school.teachers) {
                    if (school.teachers[i] === $scope.authentication.user._id.toString()) {
                        school.teachers.splice(i, 1);
                    }
                }

                school.$update();
            } else if ($scope.unsubscribeStudent) {
                for (var j in school.students) {
                    if (school.students[j] === $scope.authentication.user._id.toString()) {
                        school.students.splice(j, 1);
                    }
                }

                school.$update();
            } else {
                if ($scope.options.asStudent) {
                    if (school.students.indexOf($scope.authentication.user._id) === -1) {
                        school.students.push($scope.authentication.user._id);
                        school.$update();
                    }
                }

                if ($scope.options.asTeacher) {
                    if (school.teachers.indexOf($scope.authentication.user._id) === -1) {
                        school.teachers.push($scope.authentication.user._id);
                        school.$update();
                    }
                }
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