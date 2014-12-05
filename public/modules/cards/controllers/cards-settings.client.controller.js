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
            {name: 'Don\'t Change', code: ''},
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

        $scope.options.checks = ['Don\'t Change', 'Computer Checks', 'Self Check', 'Mixed Checks'];



        var reset = function() {
            $scope.options.openDueDateCalendar = false;
            $scope.options.openStartDateCalendar = false;

            $scope.options.languageFront = $scope.languages[0];
            $scope.options.languageBack = $scope.languages[0];

            $scope.options.changeStartDate = 'off';
            $scope.options.changeDueDate = 'off';

            $scope.options.check = 'Don\'t Change';


            $scope.options.startDate = undefined;
            $scope.options.dueDate = undefined;
        };

        reset();


        $scope.updateCards = function () {




                if ($scope.options.check === 'Computer Checks') {
                    $scope.card.check = 'computer';
                }
                if ($scope.options.check === 'Self Check') {
                    $scope.card.check = 'self';
                }
                if ($scope.options.check === 'Mixed Checks') {
                    $scope.card.check = 'mixed';
                }

                if ($scope.options.languageFront.name !== 'Don\'t Change') {
                    $scope.card.languageFront = $scope.options.languageFront;
                }

                if ($scope.options.languageBack.name !== 'Don\'t Change') {
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