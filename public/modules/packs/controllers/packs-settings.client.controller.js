'use strict';

angular.module('packs').controller('PacksSettingsController', ['$scope', '$modal', '$timeout', 'Cards',
    function ($scope, $modal, $timeout, Cards) {

        $scope.options = {};

        $scope.areYouSureToDeleteCard = function (card) {

            $scope.card = card;

            $modal.open({
                templateUrl: 'areYouSureToDeleteCard.html',
                controller: 'DeleteCardController',
                resolve: {
                    card: function () {
                        return $scope.card;
                    }
                }
            });


        };

        $scope.saveSettings = function () {

            $timeout(function () {
                $scope.pack.name = $scope.options.name;
                $scope.pack.$update();
            }, 100);
        };


        $scope.openDueDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.options.openDueDateCalendar = !$scope.options.openDueDateCalendar;
            //$scope.options.openDueDateCalendar = !$scope.options.openDueDateCalendar;
        };

        $scope.openStartDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.options.openStartDateCalendar = !$scope.options.openStartDateCalendar;
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

                if ($scope.options.languageFront.name !== 'Don\'t Change') {
                    card.languageFront = $scope.options.languageFront;
                }

                if ($scope.options.languageBack.name !== 'Don\'t Change') {
                    card.languageBack = $scope.options.languageBack;
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

                // this is all right, as we are only updating subdocuments
                new Cards(card).$update(function (card) {
                    console.log(card.question);
                });


            });

            reset();
        };
    }
]);
