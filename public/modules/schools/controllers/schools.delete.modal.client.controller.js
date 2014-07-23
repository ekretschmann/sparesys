'use strict';

angular.module('schools').controller('DeleteSchoolModalController', ['$scope', '$state', '$modalInstance', 'school', 'Schools',
	function($scope, $state, $modalInstance, school, Schools) {
        $scope.school = school;

        $scope.ok = function () {
            Schools.remove(school, function () {

                $state.go($state.$current, null, { reload: true });
            });


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);