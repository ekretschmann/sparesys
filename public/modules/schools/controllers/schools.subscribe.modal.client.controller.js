'use strict';

angular.module('schools').controller('SubscribeToSchoolModalController', ['$scope', '$location', '$modalInstance', 'Authentication', 'school', 'Schools',
	function($scope, $location, $modalInstance, Authentication, school, Schools) {

        $scope.authentication = Authentication;
        $scope.school = school;

        $scope.ok = function () {


            if (school.students.indexOf($scope.authentication.user._id) === -1) {
                school.students.push($scope.authentication.user._id);
                school.$update();
                console.log(school.students);
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