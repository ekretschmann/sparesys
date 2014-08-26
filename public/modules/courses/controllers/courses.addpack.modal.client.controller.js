'use strict';

angular.module('courses').controller('AddPackToCourseController', ['$scope', '$state', '$timeout', '$modalInstance', 'course', 'Packs', 'JourneyService',
	function($scope, $state, $timeout, $modalInstance, course, Packs, JourneyService) {
        $scope.course = course;

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.addpackfocus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.addPackToCourse = function () {

            // Create new Pack object
            var pack = new Packs({
                name: this.name,
                course: this.course._id
            });


            // Redirect after save
            pack.$save(function (response) {
                var packid = response._id;
                var c = $scope.course;
                c.packs.push(packid);
                c.$update(function () {
                    $scope.name = '';
                    JourneyService.packCreated();
                    $state.go($state.$current, null, { reload: true });
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });


            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            this.name = '';
            angular.element('.addpackfocus').trigger('focus');
        };
	}
]);