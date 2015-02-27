'use strict';

angular.module('courses').controller('CoursesSettingsController', ['$window', '$scope', '$timeout', 'Cards',
    function ($window, $scope, $timeout, Cards) {


        $scope.options = {};


        $scope.saveSettings = function () {

            $timeout(function () {
                $scope.course.name = $scope.options.name;
                $scope.course.description = $scope.options.description;
                $scope.course.front = $scope.options.front;
                $scope.course.back = $scope.options.back;

                $scope.course.$update();
            }, 100);
        };


        $scope.openDueDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.options.openDueDateCalendar = true;
        };

        $scope.openStartDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.options.openStartDateCalendar = true;
        };


        $scope.languages = [
            {name: 'Don\'t Change', code: ''},
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

        $scope.options.checks = ['Don\'t Change', 'Computer Checks', 'Self Check', 'Mixed Checks'];


        var reset = function () {
            $scope.options.openDueDateCalendar = false;
            $scope.options.openStartDateCalendar = false;

            $scope.options.languageFront = $scope.languages[0];
            $scope.options.languageBack = $scope.languages[0];

            $scope.options.changeStartDate = 'off';
            $scope.options.changeDueDate = 'off';

            $scope.options.check = 'Don\'t Change';


            $scope.options.startDate = undefined;
            $scope.options.dueDate = undefined;

            $scope.options.name = $scope.course.name;
            $scope.options.description = $scope.course.description;
            $scope.options.teaching = $scope.course.teaching;
            $scope.options.front = $scope.course.front;
            $scope.options.back = $scope.course.back;
        };

        reset();


        $scope.updateFeedback = false;
        $scope.updateCards = function () {


            $scope.course.name = $scope.options.name;
            $scope.course.description = $scope.options.description;
            $scope.course.front = $scope.options.front;
            $scope.course.back = $scope.options.back;

            var cards = $scope.course.cards;
            var showCards = $scope.course.showCards;

            $scope.course.cards.forEach(function (card) {


                if ($scope.options.check === 'Computer Checks') {
                    card.check = 'computer';
                }
                if ($scope.options.check === 'Self Check') {
                    card.check = 'self';
                }
                if ($scope.options.check === 'Mixed Checks') {
                    card.check = 'mixed';
                }

                if ($scope.options.languageFront.name !== 'Don\'t Change') {
                    card.languageFront = $scope.options.languageFront;
                }

                if ($scope.options.languageFront.name === 'None') {
                    card.languageFront = undefined;
                }

                if ($scope.options.languageBack.name !== 'Don\'t Change') {
                    card.languageBack = $scope.options.languageBack;
                }

                if ($scope.options.languageBack.name === 'None') {
                    card.languageBack = undefined;
                }


                if ($scope.options.startDate) {
                    card.startDate = $scope.options.startDate;
                }

                if ($scope.options.dueDate) {
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

            $scope.course.$update(function () {

                console.log('ga landing');
                console.log('/courses/:id/edit');
                if ($window.ga) {
                    console.log('sending to ga');
                    $window.ga('send', 'pageview', '/courses/:id/edit');
                    $window.ga('send', 'event', 'updating all cards for course');
                }

                $scope.updateFeedback = true;
                $timeout(function () {
                    $scope.updateFeedback = false;
                }, 2000);

                $scope.course.cards = cards;
                $scope.course.showCards = showCards;
                reset();
            });


        };
    }
]);