'use strict';

angular.module('schoolclasses').controller('DeleteClassModalController', ['$scope', '$location', '$state', '$modalInstance', 'schoolclass',
	function($scope, $location, $state, $modalInstance, schoolclass) {
        $scope.schoolclass = schoolclass;

        $scope.ok = function () {
            schoolclass.$remove(schoolclass, function () {


//                $location.path('/schools/classes/manage');
                $state.go($state.$current, null, {reload:true});
            });

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);