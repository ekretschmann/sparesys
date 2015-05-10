'use strict';


// Courses controller
angular.module('courses').controller('CoursesAdminController',
    ['$scope', '$stateParams', '$location','Authentication', 'Courses',
        function ($scope, $stateParams, $location, Authentication, Courses) {

            $scope.authentication = Authentication;


            if (!$scope.authentication.user) {
                $location.path('/');
            }

            $scope.removeSlave = function(slave, course) {
                var index = course.slaves.indexOf(slave);
                course.slaves.splice(index, 1);
                course.$update();
            };




            // Update existing Course
            $scope.update = function () {
                var course = $scope.course;

                if(!course.slaves) {
                    course.slaves=[];
                }
                course.$update(function () {
                    $location.path('courses');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };



            $scope.otherUserCourses = [];

            // Find existing Course
            $scope.findOne = function () {

                $scope.course = Courses.get({
                    courseId: $stateParams.courseId,
                    populateUser: false
                });


            };


            // Find existing Course
            $scope.findById = function (id) {

                $scope.course = Courses.get({
                    courseId: id
                });
            };

            $scope.findOtherCourse = function (id) {

                $scope.otherCourse = Courses.get({
                    courseId: id
                });
            };


        }
    ]);