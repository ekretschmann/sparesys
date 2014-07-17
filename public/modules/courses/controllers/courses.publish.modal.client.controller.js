'use strict';

angular.module('courses').controller('PublishCourseModalController', ['$scope', '$state', '$modalInstance', 'course', 'CoursesService',
	function($scope, $state, $modalInstance, course, CoursesService) {
        $scope.course = course;

        $scope.ok = function () {
//            CoursesService.remove(course, function () {
//                $state.go($state.$current, null, { reload: true });
//            });

            course.published = true;
            course.$update();

            $modalInstance.close();

        };

        $scope.cancel = function () {


            course.published = false;
            $modalInstance.dismiss('cancel');
        };
	}
]);