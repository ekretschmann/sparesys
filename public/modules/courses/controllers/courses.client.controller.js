'use strict';


// Courses controller
angular.module('courses').controller('CoursesController',
    ['$window', '$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards', 'CoursesService', 'TestDataService', 'JourneyService',
        function ($window, $scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards, CoursesService, TestDataService, JourneyService) {

            $scope.authentication = Authentication;
            $scope.showhelp = false;
            $scope.tabs = [
                {title: 'Course', active: false},
                {title: 'Packs', active: true},
                {title: 'Cards', active: false},
                {title: 'Forward', active: false},
                {title: 'Reverse', active: false},
                {title: 'Images', active: false}
            ];


            $scope.toggle = true;
            $scope.toggleIt = function () {
                $scope.toggle = !$scope.toggle;
            };


            $scope.MAX_SHOW_CARDS = 12;

            $scope.languages = [
                {name: '---', code: ''},
                {name: 'Chinese', code: 'zh-CN'},
                {name: 'English (GB)', code: 'en-GB'},
                {name: 'English (US)', code: 'en-US'},
                {name: 'French', code: 'fr-FR'},
                {name: 'German', code: 'de-DE'},
                {name: 'Italian', code: 'it-IT'},
                {name: 'Japanese', code: 'ja-JP'},
                {name: 'Korean', code: 'ko-KR'},
                {name: 'Spanish', code: 'es-ES'}
            ];

            var selectedIndexFront = 0;
            var selectedIndexBack = 0;
            $scope.languageFront = $scope.languages[selectedIndexFront];
            $scope.languageBack = $scope.languages[selectedIndexBack];


            $scope.ga = function() {

                console.log('ga seraching');
                console.log('/courses/search');
                if ($window.ga) {
                    console.log('sending to ga');
                    $window.ga('send', 'pageview', '/courses/search');
                    $window.ga('send', 'event', 'search course');
                }
            };

            if (!$scope.authentication.user) {
                $location.path('/');
            }

            $scope.help = function () {
                $scope.showhelp = !$scope.showhelp;
            };


            $scope.cleanDatabase = function () {
                Courses.query(function (courses) {
                    var validCourseIds = [];
                    courses.forEach(function (course) {
                        validCourseIds.push(course._id);
                    });

                    Packs.query(function (packs) {
                        var validPackIds = [];
                        packs.forEach(function (pack) {
                            if (validCourseIds.indexOf(pack.course) === -1) {
                                console.log('deleting pack ' + pack._id);
                                pack.$remove();
                            } else {
                                validPackIds.push(pack._id);
                            }

                        });

                        Cards.query(function (cards) {
                            cards.forEach(function (card) {
                                if (validPackIds.indexOf(card.pack) === -1) {
                                    console.log('deleting card ' + card._id);
                                    card.$remove();
                                }
                            });
                        });
                    });
                });
            };


            $scope.createDummyCourse = function () {

                TestDataService.createDummmyCourse(function () {
                    $state.go($state.$current, null, {reload: true});
                });
            };

            $scope.copy = function (course, target) {

                $modal.open({
                    templateUrl: 'copiedCourse.html',
                    controller: 'CopiedCourseModalController',
                    resolve: {

                        target: function () {
                            return target;
                        },
                        course: function () {
                            return course;
                        }
                    }
                });

            };


            // Create new Course
            $scope.create = function () {
                var course = new Courses({
                    name: this.name,
                    description: this.description,
                    back: this.back,
                    front: this.front,
                    readfront: this.readFront,
                    readback: this.readBack,
                    language: this.languageFront,
                    languageback: this.languageback,
                    speechrecognition: this.speechRecognition,
                    teaching: this.teaching
                });

                // Redirect after save
                course.$save(function (response) {

                    console.log('ga create course');
                    console.log($location.url());
                    if ($window.ga) {
                        console.log('sending to ga');
                        $window.ga('send', 'pageview', {page: $location.url()});
                        $window.ga('send', 'event', 'create course');
                    }


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

                console.log(course.slaves);
                if(!course.slaves) {
                    course.slaves=[];
                }
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


            $scope.manageCourses = function() {
                console.log('ga view courses');
                console.log('/courses');
                if ($window.ga) {
                    console.log('sending to ga');
                    $window.ga('send', 'pageview', '/courses');
                    $window.ga('send', 'event', 'user views their courses');
                }
                $scope.findForCurrentUser();
            };

            // Find list for current user
            $scope.findForCurrentUser = function () {
                if ($scope.authentication.user) {
                    Courses.query({
                        userId: $scope.authentication.user._id
                    }, function (courses) {
                        $scope.courses = [];
                        courses.forEach(function (course) {
                            if (course.visible) {
                                $scope.courses.push(course);
                            }

                        }, this);

                        $scope.coursesStudent = [];
                        $scope.coursesTeacher = [];

                        $scope.courses.forEach(function (course) {
                            if (course.teaching) {
                                $scope.coursesTeacher.push(course);
                            } else {
                                $scope.coursesStudent.push(course);
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
                $scope.duplicateCourse = false;


                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                }, function () {


                    var res = CoursesService.serverLoadCards();
                    res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {

                        $scope.course.cards = cards;
                        $scope.course.showCards = [];
                        var showSize = Math.min(cards.length, $scope.MAX_SHOW_CARDS);
                        for (var i = 0; i < showSize; i++) {
                            $scope.course.showCards.push(cards[i]);
                        }

                    });
                });


            };

            //$scope.animation = {};
            //$scope.animation.show = true;
            //$scope.doit = function() {
            //    $scope.animation.show = !$scope.animation.show;
            //
            //};

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

            $scope.showMoreInfo = function (file) {

                $modal.open({
                    templateUrl: 'showMoreInfo.html',
                    controller: 'ShowMoreInfoController',
                    resolve: {

                        file: function () {
                            return file;
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


            $scope.subscribePopup = function(course) {
                $modal.open({
                    templateUrl: 'subscribeToCourse.html',
                    controller: 'SubscribeToCourseController',
                    resolve: {
                        course: function () {
                            return course;
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

                start: function (e, ui) {
                    console.log(ui.item.index());
                },
                stop: function (e, ui) {

                    console.log(ui.item.index());
                    var showCards = $scope.course.showCards;
                    $scope.course.$update(function (course) {
                        $scope.course.showCards = showCards;
                    });

                }
            };
        }
    ]);