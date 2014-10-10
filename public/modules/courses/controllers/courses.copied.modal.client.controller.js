'use strict';

angular.module('courses').controller('CopiedCourseModalController', ['$scope', '$state', '$location', '$modalInstance', 'CoursesService', 'course',  'target',
	function($scope, $state, $location, $modalInstance, CoursesService, course,  target) {
        $scope.course = course;
        $scope.target = target;



        $scope.ok = function (target) {


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