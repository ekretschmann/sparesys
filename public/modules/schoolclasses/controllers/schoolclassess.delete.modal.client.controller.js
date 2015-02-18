'use strict';

angular.module('schoolclasses').controller('DeleteClassModalController', ['$scope', '$location', '$state', '$modalInstance', 'schoolclass', 'Schoolclasses',
	function($scope, $location, $state, $modalInstance, schoolclass, Schoolclasses) {
        $scope.schoolclass = schoolclass;


        $scope.ok = function () {

            var schoolId = schoolclass.school._id;


            console.log($scope.schoolclass);

            new Schoolclasses($scope.schoolclass).$remove(function () {
//
//
                $state.go($state.$current, null, {reload:true});
//                $location.path('schools/'+schoolId+'/edit');
//
            });
//
            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);