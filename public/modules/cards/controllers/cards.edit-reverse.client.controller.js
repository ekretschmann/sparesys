'use strict';

angular.module('cards').controller('EditCardReverseController', ['$scope', '$timeout','Cards',
    function ($scope, $timeout, Cards) {


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
                $scope.updateView();

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
                $scope.card.alternativesBack.push($scope.nextAlternative);
                $scope.nextAlternative = undefined;

                $timeout(function () {
                    angular.element('#alternative').trigger('focus');
                }, 100);
            }
            new Cards($scope.card).$update();


        };


        $scope.updateAlternative = function (index, alt) {

            $scope.card.alternativesBack[index] = alt;
            var alts = [];
            $scope.card.alternativesBack.forEach(function (alt) {
                if (alt !== undefined && alt !== '') {
                    alts.push(alt);
                }
            });
            $scope.card.alternativesBack = alts;
            $scope.updateCard();
        };
    }
]);