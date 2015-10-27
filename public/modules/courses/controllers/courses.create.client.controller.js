'use strict';


// Courses controller
angular.module('courses').controller('CoursesCreateController',
    ['$window', '$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards', 'CoursesService',
        function ($window, $scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards, CoursesService) {

            $scope.authentication = Authentication;
            $scope.showhelp = false;
            $scope.useForwardMode = true;
            $scope.useReverseMode = false;
            $scope.useImagesMode = false;
            $scope.readQuestionsForward = false;
            $scope.readAnswersForward = false;
            $scope.readQuestionsReverse = false;
            $scope.readAnswersReverse = false;
            $scope.readQuestionsImages = false;
            $scope.readAnswersImages = false;
            $scope.teaching = false;
            $scope.timedForward = false;
            $scope.timedReverse = false;
            $scope.timedImages = false;
            $scope.limitForward = 10;
            $scope.limitReverse = 10;
            $scope.limitImages = 10;


            $scope.checks = ['Self Checks', 'Computer Checks', 'Mixed Checks'];


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
            var selectedIndexChecks = 0;
            $scope.languageFront = $scope.languages[selectedIndexFront];
            $scope.languageBack = $scope.languages[selectedIndexBack];
            $scope.check = $scope.checks[selectedIndexChecks];

            $scope.setLanguageFront = function (lang) {
                $scope.languageFront = lang;

            };

            $scope.setLanguageBack = function (lang) {
                $scope.languageBack = lang;
            };

            $scope.setCheck = function (check) {
                $scope.check = check;
            };

            $scope.upload = function () {
                console.log('here');
            };

            // Create new Course
            $scope.createCourse = function () {

                var cardDefaults = {
                    languageFront: $scope.languageFront,
                    languageBack: $scope.languageBack,
                    checks: $scope.check,
                    forward: {
                        enabled: $scope.useForwardMode,
                        readFront: $scope.readQuestionsForward,
                        readBack: $scope.readAnswersForward,
                        speechRecognition: false,
                        timed: $scope.timedForward,
                        timeLimit: $scope.limitForward
                    },
                    reverse: {
                        enabled: $scope.useReverseMode,
                        readFront: $scope.readQuestionsReverse,
                        readBack: $scope.readAnswersReverse,
                        speechRecognition: false,
                        timed: $scope.timedReverse,
                        timeLimit: $scope.limitReverse
                    },
                    images: {
                        enabled: $scope.useImagesMode,
                        readFront: $scope.readQuestionsImages,
                        readBack: $scope.readAnswersImages,
                        speechRecognition: false,
                        timed: $scope.timedImages,
                        timeLimit: $scope.limitImages
                    }
                };

                var course = new Courses({
                    name: this.name,
                    description: this.description,
                    back: this.back,
                    front: this.front,
                    teaching: this.teaching,
                    cardDefaults: cardDefaults

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


        }
    ]);
