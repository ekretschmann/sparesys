'use strict';

angular.module('courses').controller('CoursesConfigController', ['$window', '$scope', '$timeout', 'Cards', 'CoursesService',
    function ($window, $scope, $timeout, Cards, CoursesService) {


        $scope.options = {};



        $scope.init = function () {

            if ($scope.course && $scope.course.cardDefaults) {
                console.log($scope.course.cardDefaults);
                $scope.options.languageOnlyFront = $scope.course.cardDefaults.languageFront;
                $scope.options.languageOnlyBack = $scope.course.cardDefaults.languageBack;
                $scope.options.check = $scope.course.cardDefaults.checks;
            }
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
            $scope.course.cardDefaults = {};
            if ($scope.options.languageOnlyFront) {
                $scope.course.cardDefaults.languageFront = $scope.options.languageOnlyFront;
            }
            if ($scope.options.languageOnlyBack) {
                $scope.course.cardDefaults.languageBack  = $scope.options.languageOnlyBack;
            }
            if ($scope.options.check) {
                $scope.course.cardDefaults.checks  = $scope.options.check;
            }

            var res = CoursesService.setCourseDefaults($scope.course._id);
            res.post({cardDefaults: $scope.course.cardDefaults});

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
