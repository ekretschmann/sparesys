'use strict';

angular.module('schools').controller('DeleteSchoolModalController', ['$scope', '$location', '$modalInstance', 'school', 'Schools',
	function($scope, $location, $modalInstance, school, Schools) {
        $scope.school = school;

        $scope.ok = function () {
            school.$remove(school, function () {

                $location.path('schools');
            });


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);