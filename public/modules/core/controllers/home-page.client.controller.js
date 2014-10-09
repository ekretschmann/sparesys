'use strict';


// Courses controller
angular.module('core').controller('HomePageController',
    ['$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards', 'CoursesService', 'TestDataService', 'JourneyService',
        function ($scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards, CoursesService, TestDataService, JourneyService) {

            $scope.authentication = Authentication;
//            $scope.showhelp = false;
//
//
//
//            if (!$scope.authentication.user) {
//                $location.path('/');
//            }
//
//            $scope.help = function() {
//                $scope.showhelp = ! $scope.showhelp;
//            };
//
//
//            $scope.cleanDatabase = function() {
//                Courses.query(function(courses) {
//                    var validCourseIds = [];
//                    courses.forEach(function(course) {
//                        validCourseIds.push(course._id);
//                    });
//
//                    Packs.query(function(packs) {
//                        var validPackIds = [];
//                        packs.forEach(function(pack) {
//                            if(validCourseIds.indexOf(pack.course) === -1) {
//                                console.log('deleting pack '+pack._id);
//                                pack.$remove();
//                            } else {
//                                validPackIds.push(pack._id);
//                            }
//
//                        });
//
//                        Cards.query(function(cards) {
//                            cards.forEach(function(card) {
//                                if(validPackIds.indexOf(card.pack) === -1) {
//                                    console.log('deleting card '+card._id);
//                                    card.$remove();
//                                }
//                            });
//                        });
//                    });
//                });
//            };
//
//            $scope.userHasCreatedPackBefore = function() {
//                return JourneyService.userHasCreatedPackBefore();
//            };
//
//            $scope.userHasEditedCourseBefore = function() {
//                return JourneyService.userHasEditedCourseBefore();
//            };
//
//            $scope.userHasCreatedCardBefore = function() {
//               return JourneyService.userHasCreatedCardBefore();
//            };
//
//            $scope.createDummyCourse = function() {
//
//                TestDataService.createDummmyCourse(function() {
//                    $state.go($state.$current, null, { reload: true });
//                });
//            };
//
//            $scope.copy = function () {
//
//
//                $modal.open({
//                    templateUrl: 'copiedCourse.html',
//                    controller: 'CopiedCourseModalController',
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
//            $scope.userHasCreatedCourseBefore = function() {
//                return JourneyService.userHasCreatedCourseBefore();
//            };
//
//            // Create new Course
//            $scope.create = function () {
//                var course = new Courses({
//                    name: this.name,
//                    description: this.description
//                });
//
//                // Redirect after save
//                course.$save(function (response) {
//                    JourneyService.courseCreated();
//                    $location.path('courses/' + response._id + '/edit');
//                }, function (errorResponse) {
//                    $scope.error = errorResponse.data.message;
//                });
//            };
//
//            // Remove existing Course
//            $scope.remove = function (course) {
//                if (course) {
//                    course.$remove();
//
//                    for (var i in $scope.courses) {
//                        if ($scope.courses[i] === course) {
//                            $scope.courses.splice(i, 1);
//                        }
//                    }
//                } else {
//                    $scope.course.$remove(function () {
//                        $location.path('courses');
//                    });
//                }
//            };
//
//            // Update existing Course
//            $scope.update = function () {
//                var course = $scope.course;
//
//                course.$update(function () {
//                    $location.path('courses');
//                }, function (errorResponse) {
//                    $scope.error = errorResponse.data.message;
//                });
//            };
//
//            // Find a list of Courses
//            $scope.find = function () {
//                $scope.courses = Courses.query();
//
//            };


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

                        console.log($scope.courses[0]);
                        console.log($scope.courses[1]);
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