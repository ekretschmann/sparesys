'use strict';

angular.module('courses').controller('CoursesSettingsController', ['$scope', 'Cards',
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
            {name: 'Leave Unchanged', code: ''},
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

        $scope.options.checks = ['Leave Unchanged', 'Computer Checks', 'Self Check', 'Mixed Checks'];



        var reset = function() {
            $scope.options.openDueDateCalendar = false;
            $scope.options.openStartDateCalendar = false;

            $scope.options.languageFront = $scope.languages[0];
            $scope.options.languageBack = $scope.languages[0];

            $scope.options.changeStartDate = 'off';
            $scope.options.changeDueDate = 'off';

            $scope.options.check = 'Leave Unchanged';


            $scope.options.startDate = undefined;
            $scope.options.dueDate = undefined;
        };

        reset();


        $scope.updateCards = function () {


            $scope.pack.cards.forEach(function (card) {


                if ($scope.options.check === 'Computer Checks') {
                    card.check = 'computer';
                }
                if ($scope.options.check === 'Self Check') {
                    card.check = 'self';
                }
                if ($scope.options.check === 'Mixed Checks') {
                    card.check = 'mixed';
                }

                if ($scope.options.languageFront.name !== 'Leave Unchanged') {
                    card.languageFront = $scope.options.languageFront;
                }

                if ($scope.options.languageBack.name !== 'Leave Unchanged') {
                    card.languageBack = $scope.options.languageBack;
                }




                if($scope.options.startDate) {
                    card.startDate = $scope.options.startDate;
                }

                if($scope.options.dueDate) {
                    card.dueDate = $scope.options.dueDate;
                }

                if ($scope.options.changeStartDate === 'reset') {
                    card.startDate = undefined;
                }

                if ($scope.options.changeDueDate === 'reset') {
                    card.dueDate = undefined;
                }

                new Cards(card).$update();


            });

            reset();
        };
    }
]);