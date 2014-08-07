'use strict';

angular.module('schools').controller('SubscribeToSchoolModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school', 'Schools',
	function($scope, $location, $modalInstance, Authentication, school, Schools) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {


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