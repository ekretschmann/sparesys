'use strict';

angular.module('courses').controller('SubscribeToCourseController', ['$scope', '$location','$modalInstance', 'course', 'Authentication', 'CoursesService',
	function($scope,  $location, $modalInstance, course, Authentication, CoursesService) {
        $scope.course = course;
        $scope.authentication = Authentication;

        $scope.subscribeAsTeacher = function () {



            var res = CoursesService.copyCourse('teach');
            res.get({courseId: $scope.course._id}).$promise.then(function () {
                $location.path('/');
                $modalInstance.close();
            });

        };

        $scope.subscribeAsStudent = function () {


            var res = CoursesService.copyCourse('learn');
            res.get({courseId: $scope.course._id}).$promise.then(function () {
                $location.path('/');
                $modalInstance.close();
            });



        };



        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);