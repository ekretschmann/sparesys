'use strict';

// Courses controller
angular.module('courses').controller('CoursesController',
    ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'CoursesService',
        function ($scope, $stateParams, $location, $modal, Authentication, Courses, CoursesService) {
            $scope.authentication = Authentication;


            // Controller for popup window displayed when deleting the course
            var AreYouSureToDeleteCourseCtrl = function ($scope, $state, $modalInstance, course) {

                $scope.course = course;

                $scope.ok = function () {
                    CoursesService.remove(course, function() {

                        if ($state.current.name === 'adminCourses') {
                            $state.go($state.$current, null, { reload: true });
                        } else {

                            $location.path('courses');
                        }
                    });


                    $modalInstance.close();

                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };

            // Create new Course
            $scope.create = function () {
                // Create new Course object
                var course = new Courses({
                    name: this.name,
                    description: this.description
                });

                // Redirect after save
                course.$save(function (response) {
                    $location.path('courses/' + response._id + '/edit');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

                // Clear form fields
                this.name = '';
            };

            // Remove existing Course
            $scope.remove = function (course) {
                if (course) {
                    course.$remove();

                    for (var i in $scope.courses) {
                        if ($scope.courses[i] === course) {
                            $scope.courses.splice(i, 1);
                        }
                    }
                } else {
                    $scope.course.$remove(function () {
                        $location.path('courses');
                    });
                }
            };

            // Update existing Course
            $scope.update = function () {
                var course = $scope.course;

                course.$update(function () {
                    $location.path('courses');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            // Find a list of Courses
            $scope.find = function () {
                $scope.courses = Courses.query();
            };

            // Find list for current user
            $scope.findForCurrentUser = function () {
                $scope.courses = Courses.query({
                    userId: $scope.authentication.user._id
                });
            };

            // Find existing Course
            $scope.findOne = function () {
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
            };

            $scope.infoCreateCourse = function () {
                // Todo: implement me
            };

            $scope.areYouSureToDeleteCourse = function (course) {

                $scope.course = course;
                var modalInstance = $modal.open({
                    templateUrl: 'areYouSureToDeleteCourse.html',
                    controller: AreYouSureToDeleteCourseCtrl,
                    resolve: {

                        course: function () {
                            return $scope.course;
                        }
                    }
                });
            };
        }
    ]);