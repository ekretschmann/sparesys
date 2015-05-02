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
            var offers = [];
            offers.push($scope.selectNumber(offers));
            offers.push($scope.selectNumber(offers));
            offers.push($scope.selectNumber(offers));
        };




        $scope.processChoice = function (choice) {

            console.log('you chose ' + choice);

            $scope.drawOffers();
            $scope.$parent.recoverFromReward();


        };

        $scope.selectNumber = function(disallowed) {

            var result = Math.floor(Math.random()*$scope.cheapItems.length);
            if (disallowed.indexOf(result) > -1) return $scope.selectNumber(disallowed);
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