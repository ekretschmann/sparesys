'use strict';

angular.module('cards').controller('EditCardForwardController', ['$scope', 'Cards',
    function ($scope, Cards) {



        $scope.muted = '';

        $scope.options = {};

        $scope.isForward = function () {
            return $scope.card.modes && $scope.card.modes.indexOf('forward') !== -1;
        };

        $scope.options.forward = $scope.isForward();

        $scope.updateMuted = function() {
            if ($scope.isForward()) {
                $scope.muted = '';
            } else {
                $scope.muted = 'text-muted';
            }
        };

        $scope.updateMuted();

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

            $scope.card.$update();
            $scope.updateMuted();
        };

        $scope.updateCard = function () {


            new Cards($scope.card).$update();


        };
    }
]);