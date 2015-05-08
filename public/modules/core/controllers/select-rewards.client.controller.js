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
        $scope.userItems = [];
        $scope.userSkills = [];


        $scope.findRewards = function () {
            $scope.rewards = Rewards.query(function () {

                var enabledItems = [];
                $scope.rewards.forEach(function (reward) {
                    if (reward.ingredients.length > 0) {

                        $scope.recipies[reward.name] = reward;
                    }
                    if (reward.type === 'Skill') {
                        $scope.skills.push(reward.name);
                        reward.enables.forEach(function (enabled) {
                            enabledItems.push(enabled);
                        });

                    }

                }, this);

                $scope.rewards.forEach(function (reward) {

                    if (enabledItems.indexOf(reward.name) > -1 ) {
                        $scope.items.push(reward);
                    }
                });

                if ($scope.items.length > 0) {
                    $scope.offers.push($scope.items[0]);
                }
                if ($scope.items.length > 1) {

                    $scope.offers.push($scope.items[1]);
                }
                if ($scope.items.length >2) {

                    $scope.offers.push($scope.items[2]);
                }

            });


        };


        $scope.distributeInventory = function() {

           // $scope.showEmptyInventoryMessage = true;

            $scope.user.inventory.forEach(function(item){
                if(item.type === 'Skill') {
                    $scope.userSkills.push(item);
                } else if (item.type ==='Item') {
                    $scope.userItems.push(item);
                }
            });
        };



        $scope.determinePossibleRecipies = function () {


            $scope.possibleRecipes = [];
            //$scope.user.inventory = [];
            console.log($scope.user.inventory);
            if (!$scope.user.inventory || $scope.user.inventory.length === 0) {

                $scope.user.inventory = {};
                $scope.user.inventory['Making Fire'] = {name: 'Making Fire', type:'Cheap Skill', amount: 1};
                console.log('distirbuting');
                $scope.distributeInventory();
            }


            Object.keys($scope.recipies).forEach(function (target) {

                var recipe = $scope.recipies[target];


                var possible = true;


                recipe.ingredients.forEach(function (ingredient) {


                    if (!$scope.user.inventory[ingredient.name]) {
                        possible = false;
                    }

                });
                if (possible) {
                    $scope.possibleRecipes.push(recipe);
                }
            });
        };


        $scope.deleteInventory = function() {
            $scope.user.inventory = {};
            new Users($scope.user).$update(function (updatedUser) {
                $scope.user = updatedUser;

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



            // $scope.offers = ['soil', 'sapling', 'water'];

            $scope.determinePossibleRecipies();


        };

        $scope.selectNumber = function (disallowed) {

            var result = Math.floor(Math.random() * $scope.items.length);
            return result;
        };

        $scope.addItem = function (choice) {

            if (!$scope.user.inventory) {
                $scope.user.inventory = {};
            }

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
            //$scope.user.inventory = {};
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