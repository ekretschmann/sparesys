'use strict';

angular.module('cards').controller('EditCardForwardController', ['$scope', '$timeout','Cards',
    function ($scope, $timeout, Cards) {


        $scope.toggleMode = function () {


            var mode = 'forward';
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

        $scope.toggleReadFrontForward = function() {

            $scope.card.readFrontForward = !$scope.card.readFrontForward;
            $scope.updateCard();
        };

        $scope.toggleSpeechRecognitionForward = function() {

            $scope.card.speechRecognitionForward = !$scope.card.speechRecognitionForward;
            $scope.updateCard();
        };


        $scope.toggleReadBackForward = function() {

            $scope.card.readBackForward = !$scope.card.readBackForward;
            $scope.updateCard();
        };

        $scope.updateCard = function () {

            if ($scope.nextAlternative) {
                $scope.card.acceptedAnswersForward.push($scope.nextAlternative);
                $scope.nextAlternative = undefined;

                $timeout(function () {
                    angular.element('#alternative').trigger('focus');
                }, 100);
            }
            new Cards($scope.card).$update();


        };


        $scope.updateAlternative = function (index, alt) {

            $scope.card.alternativesFront[index] = alt;
            var alts = [];
            $scope.card.alternativesFront.forEach(function (alt) {
                if (alt !== undefined && alt !== '') {
                    alts.push(alt);
                }
            });
            $scope.card.alternativesFront = alts;
            $scope.updateCard();
        };
    }
]);