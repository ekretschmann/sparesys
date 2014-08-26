'use strict';


// Courses controller
angular.module('courses').controller('CoursesController',
    ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'CoursesService', 'JourneyService',
        function ($scope, $stateParams, $location, $modal, Authentication, Courses, CoursesService, JourneyService) {

            $scope.authentication = Authentication;
            $scope.showhelp = false;



            if (!$scope.authentication.user) {
                $location.path('/');
            }

            $scope.help = function() {
                $scope.showhelp = ! $scope.showhelp;
            };


            $scope.createDummyCourse = function() {

                CoursesService.createDummmyCourse(function() {
                    //$state.go($state.$current, null, { reload: true });
                });
            };

            $scope.copy = function () {


                $modal.open({
                    templateUrl: 'copiedCourse.html',
                    controller: 'CopiedCourseModalController',
                    resolve: {

                        course: function () {
                            return $scope.course;
                        }
                    }
                });

            };

            $scope.userHasCreatedCourseBefore = function() {
                return JourneyService.userHasCreatedCourseBefore();
            };

            // Create new Course
            $scope.create = function () {
                var course = new Courses({
                    name: this.name,
                    description: this.description
                });

                // Redirect after save
                course.$save(function (response) {
                    JourneyService.courseCreated();
                    $location.path('courses/' + response._id + '/edit');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
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
                if ($scope.authentication.user) {
                    Courses.query({
                        userId: $scope.authentication.user._id
                    }, function(courses) {
                        $scope.courses = [];
                        courses.forEach(function(course) {
                            if (course.visible) {
                                $scope.courses.push(course);
                            }

                        }, this);

                    });
                }
            };

            $scope.findPublished = function () {
                $scope.courses = Courses.query({
                    published: true
                });
            };

            // Find existing Course
            $scope.findOne = function () {
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
            };

            // Find existing Course
            $scope.findById = function (id) {

                $scope.course = Courses.get({
                    courseId: id
                });
            };

            $scope.infoCreateCourse = function () {
                // Todo: implement me
            };


            $scope.areYouSureToDeleteCourse = function (course) {

                $scope.course = course;
                $modal.open({
                    templateUrl: 'areYouSureToDeleteCourse.html',
                    controller: 'DeleteCourseModalController',
                    resolve: {

                        course: function () {
                            return $scope.course;
                        }
                    }
                });

            };

            $scope.areYouSureToPublishCourse = function (course) {

                $scope.course = course;
                $modal.open({
                    templateUrl: 'areYouSureToPublishCourse.html',
                    controller: 'PublishCourseModalController',
                    resolve: {

                        course: function () {
                            return $scope.course;
                        }
                    }
                });

            };


            $scope.addPackToCoursePopup = function (size) {
                $modal.open({
                    templateUrl: 'addPackToCourse.html',
                    controller: 'AddPackToCourseController',
                    size: size,
                    resolve: {
                        course: function () {
                            return $scope.course;
                        }
                    }
                });
            };

            $scope.editCoursePopup = function (size) {
                $modal.open({
                    templateUrl: 'editCourse.html',
                    controller: 'EditCourseController',
                    size: size,
                    resolve: {
                        course: function () {
                            return $scope.course;
                        }
                    }
                });
            };


            $scope.sortableOptions = {

                stop: function (e, ui) {
                    var course = $scope.course;
                    course.$update();
                }
            };
        }
    ]);