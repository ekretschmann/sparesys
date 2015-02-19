'use strict';

angular.module('schoolclasses').controller('AddClassController', ['$scope', '$state', '$timeout', '$modalInstance', 'Schoolclasses', 'school',
	function($scope, $state, $timeout, $modalInstance, Schoolclasses, school) {

        $scope.school = school;



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
                name: this.name,
                school: $scope.school._id

            });

            schoolClass.$save(function(sc) {
                $scope.school.schoolclasses.push(schoolClass);
                $scope.school.$save(function(){

                });



            });


            // Redirect after save
            this.name = '';
            angular.element('.focus').trigger('focus');
        };
	}
]);