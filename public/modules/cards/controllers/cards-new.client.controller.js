'use strict';

// Cards controller
angular.module('cards').controller('CardsControllerNew', ['$scope', '$modal', '$timeout', '$stateParams', '$state', '$location', 'Authentication', 'Courses', 'Packs', 'Cards',
    function ($scope, $modal, $timeout, $stateParams, $state, $location, Authentication, Courses, Packs, Cards) {




        $scope.authentication = Authentication;

        $scope.check = 'self-checked for new cards';
        $scope.checks = ['computer-checked', 'self-checked', 'mixed'];


        $scope.modes = ['forward', 'reverse', 'images', 'multiple choice'];
        $scope.priorities = ['highest', 'high', 'medium', 'low', 'lowest'];

        $scope.calendar={};
        $scope.calendar.format = 'dd/MMMM/yyyy';
        $scope.calendar.openStartDateCalendar = false;
        $scope.calendar.openDueDateCalendar = false;


        $scope.languages = [
            {name:'-', code:''},
            {name:'Chinese', code:'zh-CN'},
            {name:'English (GB)', code:'en-GB'},
            {name:'English (US)', code:'en-US'},
            {name:'French', code:'fr-FR'},
            {name:'German', code:'de-DE'},
            {name:'Italian', code:'it-IT'},
            {name:'Japanese', code:'ja-JP'},
            {name:'Korean', code:'ko-KR'},
            {name:'Spanish', code:'es-ES'}
        ];

        var selectedIndex = 0;
        $scope.language = $scope.languages[selectedIndex];




        $scope.openStartDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.calendar.openStartDateCalendar = true;
        };

        $scope.openDueDateCalendar = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.calendar.openDueDateCalendar = true;
        };

        $scope.addAlternativeAnswerFront = function() {
            if ($scope.data.alternativeAnswerFront) {
                $scope.card.acceptedAnswersForward.push($scope.data.alternativeAnswerFront);
                $scope.card.$update();
                $scope.data.alternativeAnswerFront = '';
            }
        };

        $scope.addAlternativeAnswerBack = function() {
            if ($scope.data.alternativeAnswerBack) {
                $scope.card.acceptedAnswersReverse.push($scope.data.alternativeAnswerBack);
                $scope.card.$update();
                $scope.data.alternativeAnswerBack = '';
            }
        };

        $scope.deleteAlternativeAnswerFront = function(index) {
            $scope.card.acceptedAnswersForward.splice(index, 1);
            $scope.card.$update();
        };

        $scope.deleteAlternativeAnswerBack = function(index) {
            $scope.card.acceptedAnswersReverse.splice(index, 1);
            $scope.card.$update();
        };

        $scope.toggleMode = function(mode) {

            if($scope.card.modes.indexOf(mode) === -1) {
                $scope.card.modes.push(mode);
            } else {
                $scope.card.modes.splice($scope.card.modes.indexOf(mode), 1);
            }

            $scope.card.$update();


        };

        $scope.toggleSetting = function(card, setting) {
            card[setting] = !card[setting];
            $scope.card.$update();
        };


        $scope.setLanguageFront = function(lang) {
            $scope.card.languageFront = lang;
            $scope.card.$update();

        };

        $scope.setPriority = function(p) {
            $scope.card.priority = $scope.priorities.indexOf(p) +1;
            $scope.card.$update();

        };

        $scope.setLanguageBack = function(lang) {
            $scope.card.languageBack = lang;
            $scope.card.$update();
        };

        $scope.setPriority = function(p) {
          $scope.card.priority = p ;
            $scope.card.$update();
        };

        $scope.setChecks = function(c) {
            if (c === 'self-checked') {
                $scope.card.check = 'self';
            } else if (c === 'computer-checked') {
                $scope.card.check = 'computer';
            } else if (c === 'mixed') {
                $scope.card.check = 'mixed';
            }
            $scope.card.$update();
        };

        $scope.update = function() {
            $scope.card.$update();
        };


        // Find existing Card
        $scope.findOne = function () {



            $scope.card = Cards.get({
                cardId: $stateParams.cardId
            });
        };


    }
]);
