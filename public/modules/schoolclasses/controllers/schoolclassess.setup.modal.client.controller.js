'use strict';

angular.module('schoolclasses').controller('SetupClassController', ['$scope', '$location', '$state', '$modalInstance',
    'schoolclass', 'school','Schoolclasses', 'Schools',
	function($scope, $location, $state, $modalInstance, schoolclass, school, Schoolclasses, Schools) {
        $scope.schoolclass = schoolclass;
        $scope.school = school;


        $scope.ok = function () {




            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);