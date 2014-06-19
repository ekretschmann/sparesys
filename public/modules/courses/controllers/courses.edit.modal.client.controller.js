'use strict';

angular.module('courses').controller('EditCourseController', ['$scope', '$state', '$timeout', '$modalInstance', 'course',
	function($scope, $state, $timeout, $modalInstance, course) {
        $scope.course = course;

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.editCoursefocus').trigger('focus');
            },100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {

            course.name = this.name;
            course.description = this.description;
            $scope.course.$update();
            $modalInstance.dismiss('cancel');
        };
	}
]);