'use strict';

angular.module('cards').controller('EditCardReverseController', ['$scope', '$timeout',
    function ($scope, $timeout) {

        $scope.hasMode = false;

        $scope.init = function() {
            $scope.hasMode = $scope.card.modes && $scope.card.modes.indexOf('reverse') !== -1;
        };

        $scope.toggleMode = function () {


            var mode = 'reverse';
            if ($scope.card.modes.indexOf(mode) === -1) {
                $scope.card.modes.push(mode);
            } else {
                for (var i in $scope.card.modes) {
                    if ($scope.card.modes[i] === mode) {
                        $scope.card.modes.splice(i, 1);
                    }
                }
            }

            $scope.updateCard();

        };

        $scope.toggleReadFrontReverse = function() {

            $scope.card.readFrontReverse = !$scope.card.readFrontReverse;
            $scope.updateCard();
        };

        $scope.toggleSpeechRecognitionReverse = function() {

            $scope.card.speechRecognitionReverse = !$scope.card.speechRecognitionReverse;
            $scope.updateCard();
        };


        $scope.toggleReadBackReverse = function() {

            $scope.card.readBackReverse = !$scope.card.readBackReverse;
            $scope.updateCard();
        };

        $scope.updateCard = function () {

            if ($scope.nextAlternative) {
                $scope.card.acceptedAnswersReverse.push($scope.nextAlternative);
                $scope.nextAlternative = undefined;

                $timeout(function () {
                    angular.element('#alternativeReverse').trigger('focus');
                }, 100);
            }

            $scope.card.$update(function() {
                $scope.hasMode = $scope.card.modes && $scope.card.modes.indexOf('reverse') !== -1;
            });


        };


        $scope.updateAlternative = function (index, alt) {

            $scope.card.acceptedAnswersReverse[index] = alt;
            var alts = [];
            $scope.card.acceptedAnswersReverse.forEach(function (alt) {
                if (alt !== undefined && alt !== '') {
                    alts.push(alt);
                }
            });
            $scope.card.acceptedAnswersReverse = alts;
            $scope.updateCard();
        };
    }
]);
