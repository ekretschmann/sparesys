'use strict';

angular.module('courses').controller('CoursesConfigController', ['$window', '$scope', '$timeout', 'Cards', 'CoursesService',
    function ($window, $scope, $timeout, Cards, CoursesService) {


        $scope.options = {};



        $scope.init = function () {

            if ($scope.course && $scope.course.cardDefaults) {
                $scope.options.languageOnlyFront = $scope.course.cardDefaults.languageFront;
                $scope.options.languageOnlyBack = $scope.course.cardDefaults.languageBack;
                $scope.options.check = $scope.course.cardDefaults.checks;
                if (!$scope.course.cardDefaults.forward) {
                    $scope.course.cardDefaults.forward = {};
                    $scope.course.cardDefaults.forward.enabled = true;
                    $scope.course.cardDefaults.forward.readFront = false;
                    $scope.course.cardDefaults.forward.readBack = false;
                    $scope.course.cardDefaults.forward.speechRecognition = false;
                }
                $scope.options.forward = {};
                $scope.options.forward.enabled = $scope.course.cardDefaults.forward.enabled;
                $scope.options.forward.readFront = $scope.course.cardDefaults.forward.readFront;
                $scope.options.forward.readBack = $scope.course.cardDefaults.forward.readBack;
                $scope.options.forward.speechRecognition = $scope.course.cardDefaults.forward.speechRecognition;

                if (!$scope.course.cardDefaults.reverse) {
                    $scope.course.cardDefaults.reverse = {};
                    $scope.course.cardDefaults.reverse.enabled = false;
                    $scope.course.cardDefaults.reverse.readFront = false;
                    $scope.course.cardDefaults.reverse.readBack = false;
                    $scope.course.cardDefaults.reverse.speechRecognition = false;
                }
                $scope.options.reverse = {};
                $scope.options.reverse.enabled = $scope.course.cardDefaults.reverse.enabled;
                $scope.options.reverse.readFront = $scope.course.cardDefaults.reverse.readFront;
                $scope.options.reverse.readBack = $scope.course.cardDefaults.reverse.readBack;
                $scope.options.reverse.speechRecognition = $scope.course.cardDefaults.reverse.speechRecognition;

            }

            //console.log($scope.course.cardDefaults);
        };



        $scope.languagesOnly = [
            {name: 'None', code: ''},
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

        $scope.options.checksOnly = ['Computer Checks', 'Self Check', 'Mixed Checks'];


        $scope.updateDefaults = function () {

            $timeout(function() {


                $scope.course.cardDefaults = {};
                if ($scope.options.languageOnlyFront) {
                    $scope.course.cardDefaults.languageFront = $scope.options.languageOnlyFront;
                }
                if ($scope.options.languageOnlyBack) {
                    $scope.course.cardDefaults.languageBack = $scope.options.languageOnlyBack;
                }
                if ($scope.options.check) {
                    $scope.course.cardDefaults.checks = $scope.options.check;
                }

                if ($scope.options.forward) {

                    $scope.course.cardDefaults.forward = {};
                    $scope.course.cardDefaults.forward.enabled = $scope.options.forward.enabled;
                    $scope.course.cardDefaults.forward.readFront = $scope.options.forward.readFront;
                    $scope.course.cardDefaults.forward.readBack = $scope.options.forward.readBack;
                    $scope.course.cardDefaults.forward.speechRecognition = $scope.options.forward.speechRecognition;
                }

                if ($scope.options.reverse) {

                    $scope.course.cardDefaults.reverse = {};
                    $scope.course.cardDefaults.reverse.enabled = $scope.options.reverse.enabled;
                    $scope.course.cardDefaults.reverse.readFront = $scope.options.reverse.readFront;
                    $scope.course.cardDefaults.reverse.readBack = $scope.options.reverse.readBack;
                    $scope.course.cardDefaults.reverse.speechRecognition = $scope.options.reverse.speechRecognition;
                }

                var res = CoursesService.setCourseDefaults($scope.course._id);
                res.post({cardDefaults: $scope.course.cardDefaults});
            }, 200);

        };

        $scope.setLanguageFront = function (lang) {
            $scope.options.languageOnlyFront = lang.name;
            $scope.updateDefaults();

        };

        $scope.setLanguageBack = function (lang) {
            $scope.options.languageOnlyBack = lang.name;
            $scope.updateDefaults();
        };

        $scope.setCheck = function (check) {
            $scope.options.check = check;
            $scope.updateDefaults();
        };




    }
]);
