'use strict';

angular.module('courses').controller('CopiedCourseModalController', ['$scope', '$state', '$location', '$modalInstance', 'course', 'CoursesService',
	function($scope, $state, $location, $modalInstance, course, CoursesService) {
        $scope.course = course;

        $scope.ok = function () {
//            CoursesService.remove(course, function () {
//                $state.go($state.$current, null, { reload: true });
//            });

            var res = CoursesService.copyCourse($scope.course._id);
            res.get({courseId: course.courseId}).$promise.then(function () {
            });

            $location.path('/');
            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancelled');
        };

	}
]);