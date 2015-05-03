'use strict';


// Courses controller
angular.module('core').controller('RewardsController', ['$scope', '$state', '$document', 'Authentication',
    function ($scope, $state, $document, Authentication) {


        $scope.inventory = {};

        $scope.cheapItems = [
            'soil',
            'water',
            'coal',
            'clay',
            'flint',
            'sapling'


        ];


        $scope.recipies = [
            ['brick', ['clay', 1], ['fire', 1]],
            ['fire', ['coal', 1], ['flint', 1], ['kindle', 1]],
            ['kindle', ['wood', 1], ['hatchet',1]],
            ['stone hatchet', ['wooden stick', 1], ['stone blade', 1]],
            ['stone blade', ['flint', 1], ['rock', 1]],
            ['wooden stick', ['tree', 1]],
            ['tree', ['sapling',1], ['soil',1], ['water',1]]

        ];
        $scope.offers = ['soil', 'coal', 'water'];


        $scope.drawOffers = function () {

            var indexes = [];
            indexes.push($scope.selectNumber(indexes));
            indexes.push($scope.selectNumber(indexes));
            indexes.push($scope.selectNumber(indexes));

            $scope.offers = [];
            $scope.offers.push($scope.cheapItems[indexes[0]]);
            $scope.offers.push($scope.cheapItems[indexes[1]]);
            $scope.offers.push($scope.cheapItems[indexes[2]]);


            for (var i = 0; i < $scope.recipies.length; i++) {
                var recipe = $scope.recipies[i];
                var target = recipe[0];
                var possible = true;
                for (var j = 1; j < recipe.length; j++) {


                    var requiredItem = recipe[j][0];
                    if (!$scope.inventory[requiredItem]) {
                        possible = false;
                        break;
                    }

                }
                if (possible) {
                    $scope.possibleRecipes.push(target);
                }
            }


        };


        $scope.processChoice = function (selection) {


            var choice = $scope.offers[selection - 1];


            var item = $scope.inventory[choice];
            if(item) {

                console.log(item);
                console.log('increase');
                $scope.inventory[choice] ++;
            } else {

                //item = {};
                //item[choice] = 1;
                $scope.inventory[choice] = 1;

            }
            //console.log($scope.authentication.user.inventory);
            console.log($scope.inventory);
            $scope.authentication.user.inventory = $scope.inventory;
            $scope.drawOffers();

            $scope.$parent.recoverFromReward();


        };

        $scope.selectNumber = function (disallowed) {

            var result = Math.floor(Math.random() * $scope.cheapItems.length);
            if (disallowed.indexOf(result) > -1) return $scope.selectNumber(disallowed);
            return result;
        };

        //$scope.offers = [];
        $scope.possibleRecipes = [];
       // $scope.drawOffers();

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