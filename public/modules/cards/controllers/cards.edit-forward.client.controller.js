'use strict';

angular.module('cards').controller('EditCardForwardController', ['$scope', '$timeout',
    function ($scope, $timeout) {


        //$scope.card.hasForwardMode = false;
        //
        //$scope.init = function() {
        //    $scope.card.hasForwardMode = $scope.card.modes && $scope.card.modes.indexOf('forward') !== -1;
        //};


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

            $scope.card.$update();


        };


        $scope.updateAlternative = function (index, alt) {

            $scope.card.acceptedAnswersForward[index] = alt;
            var alts = [];
            $scope.card.acceptedAnswersForward.forEach(function (alt) {
                if (alt !== undefined && alt !== '') {
                    alts.push(alt);
                }
            });
            $scope.card.acceptedAnswersForward = alts;
            $scope.updateCard();
        };
    }
]);
