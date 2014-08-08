'use strict';

angular.module('schools').controller('SubscribeToSchoolModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school', 'unsubscribeTeacher',
	function($scope, $location, $modalInstance, Authentication, school, unsubscribeTeacher) {

        $scope.authentication = Authentication;
        $scope.school = school;
        $scope.unsubscribeTeacher = unsubscribeTeacher;
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
            } else {
                if ($scope.options.asStudent) {
                    if (school.students.indexOf($scope.authentication.user._id) === -1) {
                        school.students.push($scope.authentication.user._id);
                        school.$update();
                    } else {

                        for (var i in school.students) {
                            if (school.students[i] === $scope.authentication.user._id.toString()) {
                                school.students.splice(i, 1);
                            }
                        }

                        school.$update();
                        // TODO: REMOVE FROM CLASSES. SCHOOL SHOULD KNOW WHICH CLASSES IT HAS


                    }
                }

                if ($scope.options.asTeacher) {
                    if (school.teachers.indexOf($scope.authentication.user._id) === -1) {
                        school.teachers.push($scope.authentication.user._id);
                        school.$update();
                    } else {

                        for (var i in school.teachers) {
                            if (school.teachers[i] === $scope.authentication.user._id.toString()) {
                                school.teachers.splice(i, 1);
                            }
                        }

                        school.$update();
                        // TODO: REMOVE FROM CLASSES. SCHOOL SHOULD KNOW WHICH CLASSES IT HAS


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