'use strict';

angular.module('courses').controller('DeleteCourseModalController', ['$scope', '$location', '$state', '$modalInstance', 'course', 'CoursesService', 'Schoolclasses',
	function($scope, $location, $state, $modalInstance, course, CoursesService, Schoolclasses) {
        $scope.course = course;

        $scope.ok = function () {

            Schoolclasses.query({
                courses: $scope.course._id
            }, function(schoolclasses) {
                schoolclasses.forEach(function(schoolClass){

                    for (var i in schoolClass.courses) {
                        if (schoolClass.courses[i] === $scope.course._id) {
                            schoolClass.courses.splice(i, 1);
                        }
                    }
                    schoolClass.$update();
                });
            });

            console.log('here');
            CoursesService.remove(course, function () {

                console.log($state.$current.url.source);
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