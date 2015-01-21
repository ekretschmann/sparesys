'use strict';

angular.module('packs').controller('EditPackImagesController', ['$scope', 'Cards',
    function ($scope, Cards) {

        $scope.options = {};

        $scope.options.readFront = 'leave';
        $scope.options.readBack = 'leave';
        $scope.options.mode = 'leave';
        $scope.options.speech = 'leave';


        $scope.getModeStyle = function (card) {

            if (card.modes && card.modes.indexOf('images') === -1) {
                return 'text-muted';
            }
        };

        $scope.isImagesMode = function (card) {
            return card.modes && card.modes.indexOf('images') !== -1;
        };

        $scope.updateCards = function () {

            var cardsToUpdate = $scope.pack.cards.length;
            var cardsUpdated = 0;

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
                    if (card.modes.indexOf('images') === -1) {
                        card.modes.push('images');
                    }
                }

                if ($scope.options.mode === 'off') {
                    if (card.modes.indexOf('images') !== -1) {
                        card.modes.splice(card.modes.indexOf('images'), 1);
                    }
                }


                new Cards(card).$update(function() {

                    cardsUpdated++;

                    if (cardsUpdated === cardsToUpdate) {
                        $scope.options.readFront = 'leave';
                        $scope.options.readBack = 'leave';
                        $scope.options.mode = 'leave';
                        $scope.options.speech = 'leave';
                    }
                });

            });


        };
    }
]);