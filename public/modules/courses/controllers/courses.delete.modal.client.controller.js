'use strict';

angular.module('courses').controller('DeleteCourseModalControllerController', ['$scope', '$state', '$modalInstance', 'course', 'CoursesService',
	function($scope, $state, $modalInstance, course, CoursesService) {
        $scope.course = course;

        $scope.ok = function () {
            CoursesService.remove(course, function () {
                $state.go($state.$current, null, { reload: true });
            });


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);