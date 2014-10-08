'use strict';

angular.module('schoolclasses').controller('DeleteClassModalController', ['$scope', '$location', '$state', '$modalInstance', 'schoolclass',
	function($scope, $location, $state, $modalInstance, schoolclass) {
        $scope.schoolclass = schoolclass;


        $scope.ok = function () {

            var schoolId = schoolclass.school._id;
            schoolclass.$remove(function () {


//                $state.go($state.$current, null, {reload:true});
                $location.path('schools/'+schoolId+'/edit');

            });

            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);