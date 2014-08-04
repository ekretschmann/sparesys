'use strict';

angular.module('courses').controller('DeleteCourseModalController', ['$scope', '$location', '$state', '$modalInstance', 'course', 'CoursesService',
	function($scope, $location, $state, $modalInstance, course, CoursesService) {
        $scope.course = course;

        $scope.ok = function () {
            CoursesService.remove(course, function () {



                if($state.$current.url.source === '/courses') {
                    $state.go($state.$current, null, {reload: true});
                } else if($state.$current.url.source === '/courses/admin') {
                    $state.go($state.$current, null, {reload: true});
                } else {
                    $location.path('courses');
                }
            });


            $modalInstance.close();

        };



        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);