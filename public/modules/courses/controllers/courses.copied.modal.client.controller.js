'use strict';

angular.module('courses').controller('CopiedCourseModalController', ['$scope', '$state', '$location', '$modalInstance', 'CoursesService', 'course',  'target',
	function($scope, $state, $location, $modalInstance, CoursesService, course,  target) {
        $scope.course = course;
        $scope.target = target;



        $scope.ok = function () {
//            CoursesService.remove(course, function () {
//                $state.go($state.$current, null, { reload: true });
//            });

            var res = CoursesService.copyCourse($scope.course._id);
            res.get({courseId: $scope.course._id}).$promise.then(function () {
                $location.path('/');
                $modalInstance.close();
            });



        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancelled');
        };

	}
]);