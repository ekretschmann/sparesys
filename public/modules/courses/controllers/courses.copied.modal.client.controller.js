'use strict';

angular.module('courses').controller('CopiedCourseModalController', ['$scope', '$state', '$location', '$modalInstance', 'CoursesService', 'course',  'target',
	function($scope, $state, $location, $modalInstance, CoursesService, course,  target) {
        $scope.course = course;
        $scope.target = target;



        $scope.ok = function (target) {
//            CoursesService.remove(course, function () {
//                $state.go($state.$current, null, { reload: true });
//            });


            console.log(target);

            var res = CoursesService.copyCourse(target);
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