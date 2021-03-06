'use strict';

angular.module('packs').controller('EditPackForwardController', ['$scope', 'Cards',
    function ($scope, Cards) {

        $scope.options = {};

        $scope.options.readFront = 'leave';
        $scope.options.readBack = 'leave';
        $scope.options.mode = 'leave';
        $scope.options.speech = 'leave';


        $scope.checkForward = function (card) {

            if (card && card.modes && card.modes.indexOf('forward') === -1) {
                return 'text-muted';
            }
        };

        $scope.isForward = function (card) {
            if (!card) {
                return -1;
            }
            return card.modes && card.modes.indexOf('forward') !== -1;
        };

        $scope.updateCards = function () {


            $scope.pack.cards.forEach(function (card) {



                if ($scope.options.readFront === 'on') {
                    card.readFrontForward = true;
                }
                if ($scope.options.readFront === 'off') {
                    card.readFrontForward = false;
                }

                if ($scope.options.readBack === 'on') {
                    card.readBackForward = true;
                }
                if ($scope.options.readBack === 'off') {
                    card.readBackForward = false;
                }

                if ($scope.options.speech === 'on') {
                    card.speechRecognitionForward = true;
                }

                if ($scope.options.speech === 'off') {
                    card.speechRecognitionForward = false;
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

                // ok here
                new Cards(card).$update();

            });


        };
    }
]);
