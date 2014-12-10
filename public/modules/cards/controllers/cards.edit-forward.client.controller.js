'use strict';

angular.module('cards').controller('EditCardForwardController', ['$scope', '$timeout','Cards',
    function ($scope, $timeout, Cards) {


        $scope.muted = '';


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
            if ($scope.card.hasForwardMode) {
                $scope.muted = '';
            } else {
                $scope.muted = 'text-muted';
            }
        };

        $scope.updateCard = function () {

            if ($scope.nextAlternative) {
                $scope.card.alternativesFront.push($scope.nextAlternative);
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