'use strict';

angular.module('courses').controller('EditCourseController', ['$scope', '$state', '$timeout', '$modalInstance', 'course', 'Packs',
	function($scope, $state, $timeout, $modalInstance, course, Packs) {
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
            $scope.course.$update();
            $modalInstance.dismiss('cancel');
        };
	}
]);