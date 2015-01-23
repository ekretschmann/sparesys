'use strict';

angular.module('packs').controller('CardsSettingsController', ['$scope', 'Cards',
    function ($scope, Cards) {

        $scope.options = {};


        $scope.openDueDateCalendar = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.options.openDueDateCalendar = true;
        };

        $scope.openStartDateCalendar = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.options.openStartDateCalendar = true;
        };


        $scope.languages = [
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


        $scope.options.checks = ['By Computer', 'Self Check', 'Mixed'];



        var reset = function() {
            $scope.options.openDueDateCalendar = false;
            $scope.options.openStartDateCalendar = false;

            $scope.options.languageFront = $scope.card.languageFront;
            $scope.options.languageBack = $scope.card.languageBack;

            $scope.options.changeStartDate = 'off';
            $scope.options.changeDueDate = 'off';

            if ($scope.card.check === 'computer') {
                $scope.options.check = 'By Computer';
            } else if ($scope.card.check === 'self') {
                $scope.options.check = 'Self Checks';
            } else {
                $scope.options.check = 'Mixed';
            }


            $scope.options.startDate = undefined;
            $scope.options.dueDate = undefined;

            if ($scope.card.languageFront) {
                $scope.options.languageFront = $scope.card.languageFront;
            } else {
                $scope.options.languageFront = $scope.languages[0];
            }


            if ($scope.card.languageBack) {
                $scope.options.languageBack = $scope.card.languageBack;
            } else {
                $scope.options.languageBack = $scope.languages[0];
            }

        };

        reset();

        $scope.setLanguageFront = function(lang) {
            $scope.card.languageFront = lang;
            new Cards($scope.card).$update();
            reset();
        };

        $scope.setLanguageBack = function(lang) {
            $scope.card.languageBack = lang;
            new Cards($scope.card).$update();
            reset();
        };


        $scope.setCheck = function(check) {
            if (check === 'By Computer') {
                $scope.card.check = 'computer';
            }
            if (check === 'Self Check') {
                $scope.card.check = 'self';
            }
            if (check === 'Mixed') {
                $scope.card.check = 'mixed';
            }

            new Cards($scope.card).$update();
            reset();
        };

        $scope.updateCards = function () {


                if ($scope.options.languageFront.name !== 'None') {
                    $scope.card.languageFront = $scope.options.languageFront;
                }

                if ($scope.options.languageBack.name !== 'None') {
                    $scope.card.languageBack = $scope.options.languageBack;
                }




                if($scope.options.startDate) {
                    $scope.card.startDate = $scope.options.startDate;
                }

                if($scope.options.dueDate) {
                    $scope.card.dueDate = $scope.options.dueDate;
                }

                if ($scope.options.changeStartDate === 'reset') {
                    $scope.card.startDate = undefined;
                }

                if ($scope.options.changeDueDate === 'reset') {
                    $scope.card.dueDate = undefined;
                }

                new Cards($scope.card).$update();


            reset();
        };
    }
]);