'use strict';


// Courses controller
angular.module('core').controller('HomePageController',
    ['$window', '$location','$scope', '$stateParams', '$state', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards', 'CoursesService', 'TestDataService', 'JourneyService',
        function ($window, $location, $scope, $stateParams, $state, $modal, Authentication, Courses, Packs, Cards, CoursesService, TestDataService, JourneyService) {

            $scope.authentication = Authentication;


            $scope.ga = function() {

                console.log('ga home');
                console.log('/home');
                if ($window.ga) {
                    console.log('sending to ga');
                    $window.ga('send', 'pageview', '/home');
                    $window.ga('send', 'event', 'user logged in');
                }
            };



            $scope.practice = function(course) {
                $location.path('/practice/'+course._id);
            };

            // Find list for current user
            $scope.findCourses = function () {



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

                        $scope.coursesStudent = [];
                        $scope.coursesTeacher = [];

                        $scope.courses.forEach(function(course) {
                            if (course.teaching) {
                                $scope.coursesTeacher.push(course);
                            } else {
                                $scope.coursesStudent.push(course);
                            }
                        }, this);
                    });
                }
            };

//            $scope.findPublished = function () {
//                $scope.courses = Courses.query({
//                    published: true
//                });
//            };
//
//            // Find existing Course
//            $scope.findOne = function () {
//                $scope.course = Courses.get({
//                    courseId: $stateParams.courseId
//                });
//            };
//
//            // Find existing Course
//            $scope.findById = function (id) {
//
//                $scope.course = Courses.get({
//                    courseId: id
//                });
//            };
//
//            $scope.infoCreateCourse = function () {
//                // Todo: implement me
//            };
//
//
//            $scope.areYouSureToDeleteCourse = function (course) {
//
//                $scope.course = course;
//                $modal.open({
//                    templateUrl: 'areYouSureToDeleteCourse.html',
//                    controller: 'DeleteCourseModalController',
//                    resolve: {
//
//                        course: function () {
//                            return $scope.course;
//                        }
//                    }
//                });
//
//            };
//
//            $scope.areYouSureToPublishCourse = function (course) {
//
//                $scope.course = course;
//                $modal.open({
//                    templateUrl: 'areYouSureToPublishCourse.html',
//                    controller: 'PublishCourseModalController',
//                    resolve: {
//
//                        course: function () {
//                            return $scope.course;
//                        }
//                    }
//                });
//
//            };
//
//
//            $scope.addPackToCoursePopup = function (size) {
//                $modal.open({
//                    templateUrl: 'addPackToCourse.html',
//                    controller: 'AddPackToCourseController',
//                    size: size,
//                    resolve: {
//                        course: function () {
//                            return $scope.course;
//                        }
//                    }
//                });
//            };
//
            $scope.settingsPopup = function () {
                $modal.open({
                    templateUrl: 'settings.html',
                    controller: 'SettingsController',
                    resolve: {
                        user: function () {
                            return $scope.authentication.user;
                        }
                    }
                });
            };

            $scope.passwordPopup = function () {
                $modal.open({
                    templateUrl: 'password.html',
                    controller: 'SettingsController',
                    resolve: {
                        user: function () {
                            return $scope.authentication.user;
                        }
                    }
                });
            };

//
//
//            $scope.sortableOptions = {
//
//                stop: function (e, ui) {
//                    var course = $scope.course;
//                    course.$update();
//                }
//            };
        }
    ]);