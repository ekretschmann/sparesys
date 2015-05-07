'use strict';


// Courses controller
angular.module('core').controller('SelectRewardsController', ['$scope', '$state', '$document', 'Authentication', 'Users', 'Rewards',
    function ($scope, $state, $document, Authentication, Users, Rewards) {


        $scope.user = new Users($scope.authentication.user);
        $scope.recipies = {};
        $scope.rewards = [];
        $scope.skills = [];
        $scope.items = [];
        $scope.offers = [];


        $scope.findRewards = function () {
            $scope.rewards = Rewards.query(function () {

                var enabledItems = [];
                $scope.rewards.forEach(function (reward) {
                    if (reward.ingredients.length > 0) {

                        $scope.recipies[reward.name] = reward;
                    }
                    if (reward.type === 'Skill') {
                        $scope.skills.push(reward.name);
                        console.log(reward.enables);
                        reward.enables.forEach(function (enabled) {
                            enabledItems.push(enabled);
                        });

                    }

                }, this);

                console.log(enabledItems);
                $scope.rewards.forEach(function (reward) {

                    console.log(reward.name);
                    console.log(enabledItems.indexOf(reward.name));
                    if (enabledItems.indexOf(reward.name) > -1 ) {
                        $scope.items.push(reward);
                        console.log('xxxxx');
                    }
                });

                console.log($scope.items);

                    //console.log($scope.recipies);
                 //   console.log($scope.items);
                //$scope.determinePossibleRecipies();
                $scope.offers.push($scope.items[0]);
                $scope.offers.push($scope.items[1]);
                $scope.offers.push($scope.items[2]);

                console.log($scope.offers);
            });


        };


        $scope.distributeInventory = function() {

            $scope.showEmptyInventoryMessage = true;

        };


        $scope.determinePossibleRecipies = function () {


            //console.log('determining');
            $scope.possibleRecipes = [];
            //$scope.user.inventory = [];
            if (!$scope.user.inventory || $scope.user.inventory.length === 0) {

                $scope.user.inventory = {};
                $scope.user.inventory['Making Fire'] = {name: 'Making Fire', type:'Cheap Skill', amount: 1};
                $scope.distributeInventory();
            }


            Object.keys($scope.recipies).forEach(function (target) {

                //console.log(target);
                var recipe = $scope.recipies[target];

                //console.log(recipe);

                var possible = true;


                recipe.ingredients.forEach(function (ingredient) {

                    //console.log(ingredient);

                    if (!$scope.user.inventory[ingredient.name]) {
                        //console.log('not possible '+ingredient.name);
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
            $scope.offers.push($scope.items[indexes[0]]);
            $scope.offers.push($scope.items[indexes[1]]);
            $scope.offers.push($scope.items[indexes[2]]);


            console.log($scope.offers);

            // $scope.offers = ['soil', 'sapling', 'water'];

            $scope.determinePossibleRecipies();


        };

        $scope.selectNumber = function (disallowed) {

            var result = Math.floor(Math.random() * $scope.items.length);
            console.log(result);
            //if (disallowed.indexOf(result) > -1) return $scope.selectNumber(disallowed);
            return result;
        };

        $scope.addItem = function (choice) {
            var item = $scope.user.inventory[choice];

            if (item) {

                var increasedAmount = $scope.user.inventory[choice].amount++;
                $scope.user.inventory[choice] = {name: choice, amount: increasedAmount + 1};
                $scope.showEmptyInventoryMessage = false;
            } else {

                //item = {};
                //item[choice] = 1;
                $scope.user.inventory[choice] = {name: choice, amount: 1};
                $scope.showEmptyInventoryMessage = false;

            }
        };

        $scope.getRememberalia = function (choice) {


            if ($scope.recipies[choice]) {



                $scope.recipies[choice].ingredients.forEach(function (ingredient) {


                    var item = $scope.user.inventory[ingredient.name];
                    var newAmount = item.amount - ingredient.amount;
                    if (newAmount === 0) {
                        delete $scope.user.inventory[ingredient.name];
                    } else {
                        $scope.user.inventory[ingredient.name] = {name: ingredient.name, amount: newAmount};
                    }
                });

                $scope.addItem($scope.recipies[choice].name);

                //$scope.recipies[choice].receive.forEach(function (rememberalia) {
                //    $scope.addItem(rememberalia.name);
                //});
            } else {
                $scope.addItem(choice);
            }
            $scope.determinePossibleRecipies();
            //$scope.user.inventory = $scope.inventory;
            //$scope.authentication.user.$update();

            //$scope.user.inventory = {};

            //$scope.user.inventory = {};
            // console.log($scope.user.inventory);
            $scope.user.inventory = {};
            new Users($scope.user).$update(function (updatedUser) {
                $scope.user = updatedUser;

            });
        };

        $scope.processChoice = function (selection) {


            var choice = $scope.offers[selection - 1];


            $scope.getRememberalia(choice);
            $scope.drawOffers();

            $scope.$parent.recoverFromReward();


        };



        //$scope.offers = [];
        //$scope.possibleRecipes = [];
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