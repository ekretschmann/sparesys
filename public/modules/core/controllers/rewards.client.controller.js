'use strict';


// Courses controller
angular.module('core').controller('RewardsController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {


        $scope.cheapItems = [
            'rock',
            'wood',
            'water',
            'ore',
            'coal',
            'soil',
            'grass seeds'

        ];


        $scope.drawOffers = function() {
            var indexes = [];
            indexes.push($scope.selectNumber(indexes));
            indexes.push($scope.selectNumber(indexes));
            indexes.push($scope.selectNumber(indexes));

            $scope.offers = [];
            $scope.offers.push($scope.cheapItems[indexes[0]]);
            $scope.offers.push($scope.cheapItems[indexes[1]]);
            $scope.offers.push($scope.cheapItems[indexes[2]]);
        };




        $scope.processChoice = function (choice) {


            $scope.authentication.user.inventory.push($scope.offers[choice-1]);
            //$scope.authentication.user.$update();
            $scope.drawOffers();

            $scope.$parent.recoverFromReward();


        };

        $scope.selectNumber = function(disallowed) {

            var result = Math.floor(Math.random()*$scope.cheapItems.length);
            if (disallowed.indexOf(result) > -1) return $scope.selectNumber(disallowed);
            return result;
        };

        $scope.offers = [];
        $scope.drawOffers();

        $document.bind('keypress', function (event) {


            $state.go($state.current);


            if ($scope.$parent.mode !== 'reward') {
                return;
            }


            if ($state.$current.url.source !== '/practice/:courseId') {
                return;
            }


            if (event.charCode === 49) {
                $scope.processChoice(1);
            }
            if (event.charCode === 50) {
                $scope.processChoice(2);
            }
            if (event.charCode === 51) {
                $scope.processChoice(3);
            }


        });

    }]);