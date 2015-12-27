'use strict';

// Cards controller
angular.module('cards').controller('CardsControllerNew', ['$scope', '$modal', '$timeout', '$stateParams', '$state', '$location', 'Authentication', 'Courses', 'Packs', 'Cards',
    function ($scope, $modal, $timeout, $stateParams, $state, $location, Authentication, Courses, Packs, Cards) {


        $scope.authentication = Authentication;

        $scope.check = 'self-checked for new cards';
        $scope.checks = ['computer', 'self', 'mixed'];


        $scope.modes = ['forward', 'reverse', 'images', 'multiple choice'];
        $scope.priorities = ['highest', 'high', 'medium', 'low', 'lowest'];

        $scope.calendar = {};
        $scope.calendar.format = 'dd/MMMM/yyyy';
        $scope.calendar.openStartDateCalendar = false;
        $scope.calendar.openDueDateCalendar = false;

        $scope.prevCard = undefined;
        $scope.nextCard = undefined;


        $scope.languages = [
            {name: '-', code: ''},
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

        var selectedIndex = 0;
        $scope.language = $scope.languages[selectedIndex];


        $scope.manageImages = function () {


            $modal.open({
                templateUrl: 'manageImages.html',
                controller: 'ManageImagesController',
                resolve: {
                    card: function () {
                        return $scope.card;
                    }
                }
            });
        };

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

        $scope.data = {};
        $scope.addAcceptedAnswerFront = function () {
            console.log($scope.data.acceptedAnswerFront);
            if ($scope.data.acceptedAnswerFront) {
                $scope.card.acceptedAnswersForward.push($scope.data.acceptedAnswerFront);
                $scope.card.$update();
                $scope.data.acceptedAnswerFront = '';
            }
        };

        $scope.addAcceptedAnswerBack = function () {
            if ($scope.data.acceptedAnswerBack) {
                $scope.card.acceptedAnswersReverse.push($scope.data.acceptedAnswerBack);
                $scope.card.$update();
                $scope.data.acceptedAnswerBack = '';
            }
        };

        $scope.deleteAcceptedAnswerFront = function (index) {
            $scope.card.acceptedAnswersForward.splice(index, 1);
            $scope.card.$update();
        };

        $scope.deleteAcceptedAnswerBack = function (index) {
            $scope.card.acceptedAnswersReverse.splice(index, 1);
            $scope.card.$update();
        };



        $scope.addAlternativeAnswerFront = function () {
            console.log($scope.data.alternativeAnswerFront);
            if ($scope.data.alternativeAnswerFront) {
                $scope.card.alternativeAnswersForward.push($scope.data.alternativeAnswerFront);
                $scope.card.$update();
                $scope.data.alternativeAnswerFront = '';
            }
        };

        $scope.addAlternativeAnswerBack = function () {
            if ($scope.data.alternativeAnswerBack) {
                $scope.card.alternativeAnswersReverse.push($scope.data.alternativeAnswerBack);
                $scope.card.$update();
                $scope.data.alternativeAnswerBack = '';
            }
        };

        $scope.deleteAlternativeAnswerFront = function (index) {
            $scope.card.alternativeAnswersForward.splice(index, 1);
            $scope.card.$update();
        };

        $scope.deleteAlternativeAnswerBack = function (index) {
            $scope.card.alternativeAnswersReverse.splice(index, 1);
            $scope.card.$update();
        };

        $scope.toggleMode = function (mode) {

            if ($scope.card.modes.indexOf(mode) === -1) {
                $scope.card.modes.push(mode);
            } else {
                $scope.card.modes.splice($scope.card.modes.indexOf(mode), 1);
            }

            $scope.card.$update();


        };

        $scope.toggleSetting = function (card, setting) {
            card[setting] = !card[setting];
            $scope.card.$update();
        };


        $scope.setLanguageFront = function (lang) {
            $scope.card.languageFront = lang;
            $scope.card.$update();

        };

        $scope.setPriority = function (p) {
            $scope.card.priority = $scope.priorities.indexOf(p) + 1;
            $scope.card.$update();

        };

        $scope.setLanguageBack = function (lang) {
            $scope.card.languageBack = lang;
            $scope.card.$update();
        };

        $scope.setPriority = function (p) {
            $scope.card.priority = p;
            $scope.card.$update();
        };

        $scope.setChecks = function (c) {

            $scope.card.check = c;
            $scope.card.$update();
        };

        $scope.update = function () {
            $scope.card.$update();
        };


        // Find existing Card
        $scope.findOne = function () {


            $scope.card = Cards.get({
                cardId: $stateParams.cardId
            }, function () {


                $scope.pack = Packs.get({
                    packId: $scope.card.packs[0]
                }, function() {

                    for (var i=0; i<$scope.pack.cards.length; i++) {
                        var theCard = $scope.pack.cards[i];
                        if (theCard._id === $stateParams.cardId) {
                            if (i === 0) {
                                $scope.prevCard = undefined;
                            } else {
                                $scope.prevCard = $scope.pack.cards[i-1];
                            }

                            if (i === $scope.pack.cards.length-1) {
                                $scope.nextCard = undefined;

                            } else {
                                $scope.nextCard = $scope.pack.cards[i+1];
                            }
                        }
                    }
                });


            });
        };


    }
]);
