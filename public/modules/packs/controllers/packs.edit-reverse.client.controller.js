'use strict';

angular.module('packs').controller('EditPackReverseController', ['$scope', 'Cards',
    function ($scope, Cards) {

        $scope.options = {};

        $scope.options.readFront = 'leave';
        $scope.options.readBack = 'leave';
        $scope.options.mode = 'leave';
        $scope.options.speech = 'leave';


        $scope.checkReverse = function (card) {
            if (card && card.modes && card.modes.indexOf('reverse') === -1) {
                return 'text-muted';
            }
        };

        $scope.isReverse = function (card) {
            if (!card) {
                return -1;
            }
            return card.modes && card.modes.indexOf('reverse') !== -1;
        };

        $scope.updateCards = function () {

            $scope.pack.cards.forEach(function (card) {


                if ($scope.options.mode === 'on') {
                    if (card.modes.indexOf('reverse') === -1) {
                        card.modes.push('reverse');
                    }
                }

                if ($scope.options.mode === 'off') {
                    if (card.modes.indexOf('reverse') !== -1) {
                        card.modes.splice(card.modes.indexOf('reverse'), 1);
                    }
                }


                if ($scope.options.readFront === 'on') {
                    card.readFrontReverse = true;
                }
                if ($scope.options.readFront === 'off') {
                    card.readFrontReverse = false;
                }

                if ($scope.options.readBack === 'on') {
                    card.readBackReverse = true;
                }
                if ($scope.options.readBack === 'off') {
                    card.readBackReverse = false;
                }

                if ($scope.options.speech === 'on') {
                    card.speechRecognitionReverse = true;
                }

                if ($scope.options.speech === 'off') {
                    card.speechRecognitionReverse = false;
                }




                var nc =  new Cards(card);
                nc.$update();

            });

        };
    }
]);