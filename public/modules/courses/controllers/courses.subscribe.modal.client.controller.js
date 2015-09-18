'use strict';

angular.module('courses').controller('SubscribeToCourseController', ['$scope', '$window', '$location','$modalInstance', 'course', 'Authentication', 'CoursesService',
	function($scope,  $window, $location, $modalInstance, course, Authentication, CoursesService) {
        $scope.course = course;
        $scope.authentication = Authentication;

        $scope.subscribeAsTeacher = function () {




            var res = CoursesService.copyCourse('teach');
            res.get({courseId: $scope.course._id}).$promise.then(function () {
                $location.path('/');
                //
                //console.log('ga subsribe teacher');
                //console.log('/courses/:id/susbscribe/teacher');
                //if ($window.ga) {
                //    console.log('sending to ga');
                //    $window.ga('send', 'pageview', '/courses/:id/subscribe/teacher');
                //    $window.ga('send', 'event', 'subscribe teacher');
                //}

                $modalInstance.close();
            });



        };

        $scope.subscribeAsStudent = function () {


            var res = CoursesService.copyCourse('learn');
            res.get({courseId: $scope.course._id}).$promise.then(function () {
                $location.path('/');

                //console.log('ga subsribe student');
                //console.log('/courses/:id/susbscribe/student');
                //if ($window.ga) {
                //    console.log('sending to ga');
                //    $window.ga('send', 'pageview', '/courses/:id/subscribe/student');
                //    $window.ga('send', 'event', 'subscribe student');
                //}
                $modalInstance.close();
            });



        };



        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);