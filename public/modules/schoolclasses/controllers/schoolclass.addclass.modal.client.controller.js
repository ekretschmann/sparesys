'use strict';

angular.module('schoolclasses').controller('AddClassController', ['$scope', '$state', '$timeout', '$modalInstance', 'Schoolclasses', 'classlist',
	function($scope, $state, $timeout, $modalInstance, Schoolclasses, classlist) {

        $scope.schoolclasses = classlist;

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.focus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addClass = function () {

//            Create new Pack object
            var schoolClass = new Schoolclasses({
                name: this.name
            });


            $scope.schoolclasses.push(schoolClass);
            // Redirect after save
            schoolClass.$save();
            this.name = '';
            angular.element('.focus').trigger('focus');
        };
	}
]);