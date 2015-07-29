'use strict';


// Courses controller
angular.module('courses').controller('CoursesCreateController',
    ['$window', '$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards', 'CoursesService',
        function ($window, $scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards, CoursesService) {

            $scope.authentication = Authentication;
            $scope.showhelp = false;
            $scope.useForwardMode = true;


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






        }
    ]);
