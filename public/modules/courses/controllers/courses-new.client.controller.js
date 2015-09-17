'use strict';


// Courses controller
angular.module('courses').controller('CoursesControllerNew',
    ['$window', '$timeout','$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards', 'CoursesService',
        function ($window, $timeout, $scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards, CoursesService) {

            $scope.authentication = Authentication;

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

            $scope.checks = {};
            $scope.checks.self = 'self-checked';
            $scope.checks.mixed = 'mixed';
            $scope.checks.computer = 'computer-checked';

            var selectedIndexFront = 0;
            var selectedIndexBack = 0;
            $scope.languageFront = $scope.languages[selectedIndexFront];
            $scope.languageBack = $scope.languages[selectedIndexBack];



            $scope.options = {};
            $scope.updateSearch = function () {


                Courses.query({
                    text: $scope.options.searchText
                }, function(users) {
                    $scope.users = users;

                });
            };

            $scope.ga = function () {

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


            $scope.setLanguageFront = function(lang) {

                $scope.course.cardDefaults.languageFront = lang;
                $scope.course.$update();
            };

            $scope.setLanguageBack = function(lang) {
                $scope.course.cardDefaults.languageBack = lang;
                $scope.course.$update();
            };

            $scope.setCheck = function(check) {
                if(check === 'computer-checked') {
                    $scope.course.cardDefaults.checks = 'computer';
                } else if(check === 'self-checked') {
                    $scope.course.cardDefaults.checks = 'self';
                } if(check === 'mixed') {
                    $scope.course.cardDefaults.checks = 'mixed';
                }
                $scope.course.$update();
            };

            $scope.toggleMode = function(mode) {

                if(mode === 'forward') {
                    $scope.course.cardDefaults.forward.enabled = !$scope.course.cardDefaults.forward.enabled;
                } else if(mode === 'reverse') {
                    $scope.course.cardDefaults.reverse.enabled = !$scope.course.cardDefaults.reverse.enabled;
                } else if(mode === 'images') {
                    $scope.course.cardDefaults.images.enabled = !$scope.course.cardDefaults.images.enabled;
                }
                $scope.course.$update();
            };

            $scope.toggleSetting = function(mode, setting) {
                if (mode === 'forward') {
                    if (setting === 'readFront') {
                        $scope.course.cardDefaults.forward.readFront = !$scope.course.cardDefaults.forward.readFront;
                    } else if (setting === 'readBack') {
                        $scope.course.cardDefaults.forward.readBack = !$scope.course.cardDefaults.forward.readBack;
                    } else if (setting === 'speechRecognition') {
                        $scope.course.cardDefaults.forward.speechRecognition = !$scope.course.cardDefaults.forward.speechRecognition;
                    }
                } else if (mode === 'reverse') {
                    if (setting === 'readFront') {
                        $scope.course.cardDefaults.reverse.readFront = !$scope.course.cardDefaults.reverse.readFront;
                    } else if (setting === 'readBack') {
                        $scope.course.cardDefaults.reverse.readBack = !$scope.course.cardDefaults.reverse.readBack;
                    } else if (setting === 'speechRecognition') {
                        $scope.course.cardDefaults.reverse.speechRecognition = !$scope.course.cardDefaults.reverse.speechRecognition;
                    }
                } else if (mode === 'images') {
                    if (setting === 'readFront') {
                        $scope.course.cardDefaults.images.readFront = !$scope.course.cardDefaults.images.readFront;
                    } else if (setting === 'readBack') {
                        $scope.course.cardDefaults.images.readBack = !$scope.course.cardDefaults.images.readBack;
                    } else if (setting === 'speechRecognition') {
                        $scope.course.cardDefaults.images.speechRecognition = !$scope.course.cardDefaults.images.speechRecognition;
                    }
                }

                $scope.course.$update();
            };


            $scope.scrollDown = function() {
                $window.scrollTo(0, document.body.scrollHeight);
                angular.element('.focus').trigger('focus');
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


            $scope.removeCourse = function (course) {
                $scope.remove(course);
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
                    $state.go($state.current, null, {reload: true});
                } else {
                    $scope.course.$remove(function () {
                        $location.path('courses');
                    });
                }
            };

            // Update existing Course
            $scope.update = function () {

                $scope.course.$update();
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
                }, function (c) {

                    //console.log(c);

                    //var res = CoursesService.serverLoadCards();
                    //res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                    //    $scope.course.cards = cards;
                    //    $scope.course.showCards = [];
                    //    var showSize = Math.min(cards.length, $scope.MAX_SHOW_CARDS);
                    //    for (var i = 0; i < showSize; i++) {
                    //        $scope.course.showCards.push(cards[i]);
                    //    }
                    //
                    //});
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

                console.log(id);
                $scope.course = Courses.get({
                    courseId: id
                });
            };

            $scope.findOtherCourse = function (id) {

                $scope.otherCourse = Courses.get({
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


            $scope.subscribePopup = function (course) {
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





            $scope.addPackToCourse = function () {


                var self = {};
                self.name = this.name;
                self.slavesToSave = $scope.course.slaves.length;
                self.slavesSaved = 0;
                self.slaves = [];

                // Create new Pack object
                var pack = new Packs({
                    name: $scope.newpack.name,
                    course: $scope.course._id
                });


                pack.$save(function (response) {


                    ////console.log('ga create pack');
                    ////console.log('/courses/addpacktocourse');
                    //if ($window.ga) {
                    //    console.log('sending to ga');
                    //    $window.ga('send', 'pageview', '/courses/addpacktocourse');
                    //    $window.ga('send', 'event', 'create pack');
                    //}

                    var packid = response._id;
                    $scope.course.packs.push(packid);


                    $scope.course.$update(function () {
                        $scope.newpack.name = '';
                        angular.element('.focus').trigger('focus');

                        $scope.newpack.name = '';

                        if ($scope.course.packs.length>3) {
                            $timeout(function () {
                                $window.scrollTo(0, document.body.scrollHeight);
                            });
                        }

//                    $state.go($state.$current, null, { reload: true });
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });






                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });


            };


        }

    ]);
