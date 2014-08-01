'use strict';

angular.module('courses').controller('DeleteCourseModalController', ['$scope', '$location', '$state', '$modalInstance', 'course', 'CoursesService',
	function($scope, $location, $state, $modalInstance, course, CoursesService) {
        $scope.course = course;

        $scope.ok = function () {
            CoursesService.remove(course, function () {


//                console.log($state.$current);
//                $location.path('courses');
//                $state.go($state.$current, null, {reload: true});
            });


            $modalInstance.close();

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);