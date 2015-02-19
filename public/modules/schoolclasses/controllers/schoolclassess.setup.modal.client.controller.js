'use strict';

angular.module('schoolclasses').controller('SetupClassController', ['$scope', '$location', '$state', '$modalInstance',
    'schoolclass', 'Schoolclasses', 'Schools',
	function($scope, $location, $state, $modalInstance, schoolclass, Schoolclasses, Schools) {
        $scope.schoolclass = schoolclass;


        $scope.ok = function () {



            //for (var i in $scope.school.schoolclasses) {
            //    if ($scope.school.schoolclasses[i] === $scope.schoolclass) {
            //        $scope.school.schoolclasses.splice(i, 1);
            //    }
            //}
            //
            //new Schools($scope.school).$update(function() {
            //    new Schoolclasses($scope.schoolclass).$remove(function () {
            //        $state.go($state.$current, null, {reload: true});
            //    });
            //});


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);