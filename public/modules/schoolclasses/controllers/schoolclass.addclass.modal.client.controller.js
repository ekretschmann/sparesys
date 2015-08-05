'use strict';

angular.module('schoolclasses').controller('AddClassController', ['$scope', '$state', '$window', '$timeout', '$modalInstance', 'Schoolclasses', 'school',
	function($scope, $state, $window, $timeout, $modalInstance, Schoolclasses, school) {

        $scope.school = school;



        $scope.setFocus = function () {
            $timeout(function(){
                if (angular.element('.focus')) {
                    angular.element('.focus').trigger('focus');
                }
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

                console.log('ga create schoolclass');
                console.log('/schools/:id/addclass/:id');
                if ($window.ga) {
                    console.log('sending to ga');
                    $window.ga('send', 'pageview', '/schools/:id/addclass/:id');
                    $window.ga('send', 'event', 'user creates schoolclass');
                }

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
