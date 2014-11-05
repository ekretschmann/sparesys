'use strict';

angular.module('packs').controller('EditPackForwardController', ['$scope', 'Cards',
    function ($scope, Cards) {

        $scope.options = {};

        $scope.options.readFront = 'leave';
        $scope.options.readBack = 'leave';
        $scope.options.mode = 'leave';
        $scope.options.speech = 'leave';


        $scope.checkForward = function (card) {
            if (card.modes && card.modes.indexOf('forward') === -1) {
                return 'text-muted';
            }
        };

        $scope.isForward = function (card) {
            return card.modes && card.modes.indexOf('forward') !== -1;
        };

        $scope.updateCards = function () {


            $scope.pack.cards.forEach(function (c) {


                var card = new Cards(c);

                if ($scope.options.readFront === 'on') {
                    card.readFront = true;
                }
                if ($scope.options.readFront === 'off') {
                    card.readFront = false;
                }

                if ($scope.options.readBack === 'on') {
                    card.readBack = true;
                }
                if ($scope.options.readBack === 'off') {
                    card.readBack = false;
                }

                if ($scope.options.speech === 'on') {
                    card.speechRecognitionBack = true;
                }

                if ($scope.options.speech === 'off') {
                    card.speechRecognitionBack = false;
                }

                if ($scope.options.mode === 'on') {
                    if (card.modes.indexOf('forward') === -1) {
                        card.modes.push('forward');
                    }
                }

                if ($scope.options.mode === 'off') {
                    if (card.modes.indexOf('forward') !== -1) {
                        card.modes.splice(card.modes.indexOf('forward'), 1);
                    }
                }

                card.$update();

            });


        };
    }
]);