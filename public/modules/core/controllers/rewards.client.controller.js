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
            'sapling',
            'rock'


        ];


        $scope.recipies = {
            'brick': {
                'ingredients': [{name: 'clay', amount: 1}, {name: 'fire', amount: 1}],
                'receive': [{name: 'brick', amount: 5}]
            },
            'fire': {
                'ingredients': [{name: 'coal', amount: 1}, {name: 'flint', amount: 1}, {
                    name: 'kindling',
                    amount: 1
                }], 'receive': [{name: 'fire', amount: 1}]
            },
            'kindling': {
                'ingredients': [{name: 'wooden stick', amount: 1}, {name: 'stone hatchet', amount: 1}],
                'receive': [{name: 'kindling', amount: 1}]
            },
            'stone hatchet': {
                'ingredients': [{name: 'wooden stick', amount: 1}, {name: 'stone blade', amount: 1}],
                'receive': [{name: 'stone hatchet', amount: 1}]
            },
            'stone blade': {
                'ingredients': [{name: 'flint', amount: 1}, {name: 'rock', amount: 1}],
                'receive': [{name: 'stone blade', amount: 1}]
            },
            'wooden stick': {
                'ingredients': [{name: 'tree', amount: 1}],
                'receive': [{name: 'wooden stick', amount: 3}]
            },
            'tree': {
                'ingredients': [{name: 'sapling', amount: 1}, {name: 'water', amount: 1}, {
                    name: 'soil',
                    amount: 1
                }], 'receive': [{name: 'tree', amount: 1}]
            }
        };
        $scope.offers = ['soil', 'sapling', 'water'];


        $scope.determinePossibleRecipies = function () {
            $scope.possibleRecipes = [];
            Object.keys($scope.recipies).forEach(function (target) {
                var recipe = $scope.recipies[target];

                var possible = true;
                recipe.ingredients.forEach(function (ingredient) {


                    if (!$scope.inventory[ingredient.name]) {
                        possible = false;
                    }

                });
                if (possible) {
                    $scope.possibleRecipes.push(recipe);
                }
            });
        };

        $scope.drawOffers = function () {

            var indexes = [];
            indexes.push($scope.selectNumber(indexes));
            indexes.push($scope.selectNumber(indexes));
            indexes.push($scope.selectNumber(indexes));

            $scope.offers = [];
            $scope.offers.push($scope.cheapItems[indexes[0]]);
            $scope.offers.push($scope.cheapItems[indexes[1]]);
            $scope.offers.push($scope.cheapItems[indexes[2]]);


           // $scope.offers = ['soil', 'sapling', 'water'];

            $scope.determinePossibleRecipies();


        };

        $scope.addItem = function (choice) {
            var item = $scope.inventory[choice];

            if (item) {

                var increasedAmount = $scope.inventory[choice].amount++;
                $scope.inventory[choice] = {name: choice, amount: increasedAmount + 1};
            } else {

                //item = {};
                //item[choice] = 1;
                $scope.inventory[choice] = {name: choice, amount: 1};

            }
        };

        $scope.getRememberalia = function (choice) {


            if ($scope.recipies[choice]) {

                $scope.recipies[choice].ingredients.forEach(function (ingredient) {
                    var item = $scope.inventory[ingredient.name];
                    var newAmount = item.amount - ingredient.amount;
                    if (newAmount === 0) {
                        delete $scope.inventory[ingredient.name];
                    } else {
                        $scope.inventory[ingredient.name] = {name: ingredient.name, amount: newAmount};
                    }
                });


                $scope.recipies[choice].receive.forEach(function (rememberalia) {
                    $scope.addItem(rememberalia.name);
                });
            } else {
                $scope.addItem(choice);
            }
            $scope.determinePossibleRecipies();
            $scope.authentication.user.inventory = $scope.inventory;
        //    $scope.authentication.user.$update();

        };

        $scope.processChoice = function (selection) {


            var choice = $scope.offers[selection - 1];


            $scope.getRememberalia(choice);
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