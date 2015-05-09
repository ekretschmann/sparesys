'use strict';


// Courses controller
angular.module('core').controller('SelectRewardsController', ['$scope', '$state', '$document', 'Authentication', 'Users', 'Rewards',
    function ($scope, $state, $document, Authentication, Users, Rewards) {


        $scope.user = new Users($scope.authentication.user);
        $scope.recipies = [];
        $scope.rewards = [];

        $scope.skills = [];


        // these are Strings
        $scope.possibleOffers = [];

        $scope.offers = [];


        $scope.userItems = [];
        $scope.userSkills = [];
        $scope.userRecipies = [];


        $scope.findRewards = function () {


            // Making fire is a fundamental skill
            if (!$scope.user.inventory || $scope.user.inventory.length === 0) {

                $scope.user.inventory = [];
                var makingFire = {name: 'Making Fire', type: 'Skill', amount: 1};
                $scope.user.inventory.push(makingFire);
            }



            $scope.rewards = Rewards.query(function () {

                $scope.findEnabledItems();
                $scope.drawOffers();


                $scope.rewards.forEach(function (reward) {
                    if (reward.type === 'Recipe') {
                        $scope.recipies.push(reward);
                    }
                });
                $scope.determinePossibleRecipies();
                $scope.distributeInventory();

            });


        };

        $scope.findEnabledItems = function () {
            var enabledItems = [];
            $scope.rewards.forEach(function (reward) {

                if (reward.type === 'Skill') {
                    reward.enables.forEach(function (enabled) {
                        enabledItems.push(enabled);
                    });


                }

            }, this);

            $scope.rewards.forEach(function (reward) {

                if (enabledItems.indexOf(reward.name) > -1) {
                    $scope.possibleOffers.push(reward);
                }

            });


        };

        $scope.getDescription = function(name) {
            var desc = '';
            $scope.rewards.forEach(function (reward) {
                if (reward.name === name) {
                    desc = reward.description;
                }
            });
            return desc;
        };

        $scope.distributeInventory = function () {

            // $scope.showEmptyInventoryMessage = true;


            $scope.userSkills = [];
            $scope.userItems = [];
            $scope.user.inventory.forEach(function (item) {


                if (item.type === 'Skill') {
                    $scope.userSkills.push(item);
                }
                if (item.type === 'Item' || item.type === 'Recipe') {
                    $scope.userItems.push(item);
                }

                item.description = $scope.getDescription(item.name);

            }, this);


        };


        $scope.determinePossibleRecipies = function () {


            $scope.possibleRecipes = [];

            $scope.recipies.forEach(function (recipe) {

                var possible = true;


                recipe.ingredients.forEach(function (ingredient) {

                    var found = false;
                    $scope.user.inventory.forEach(function (item) {
                        if (item.name === ingredient.name) {
                            found = true;
                        }
                    });
                    if (!found) {
                        possible = false;
                    }

                });
                if (possible) {
                    $scope.possibleRecipes.push(recipe);
                }
            });
        };


        $scope.deleteInventory = function () {
            $scope.user.inventory = [];
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
            if ($scope.possibleOffers.length > 0) {
                $scope.offers.push($scope.possibleOffers[indexes[0]]);
            }
            if ($scope.possibleOffers.length > 1) {

                $scope.offers.push($scope.possibleOffers[indexes[1]]);
            }
            if ($scope.possibleOffers.length > 2) {

                $scope.offers.push($scope.possibleOffers[indexes[2]]);
            }


            // $scope.offers = ['soil', 'sapling', 'water'];


        };

        $scope.selectNumber = function (disallowed) {

            var result = Math.floor(Math.random() * $scope.possibleOffers.length);
            if (disallowed.indexOf(result) > -1) {
                return $scope.selectNumber(disallowed);
            }
            return result;
        };


        $scope.removeFromInventory = function(name) {
            for (var i=0; i<$scope.user.inventory.length; i++) {
                if ($scope.user.inventory[i].name === name) {
                    $scope.user.inventory.splice(i,1);
                }
            }
        };

        $scope.getItemFromInventory = function(name) {
            var item;
            $scope.user.inventory.forEach(function (inventoryItem) {
                if (inventoryItem.name === name) {
                    item = inventoryItem;
                }
            });
            return item;
        };

        $scope.addItem = function (addedItem) {


            console.log('adding');
            console.log(addedItem);
            var choice = addedItem.name;
            if (!$scope.user.inventory) {
                $scope.user.inventory = [];
            }
            var item = $scope.getItemFromInventory(addedItem.name);



            if (item) {

                item.amount += 1;
            } else {

                //item = {};
                //item[choice] = 1;
                $scope.user.inventory.push({name: choice, amount: 1, type: addedItem.type});

            }

            $scope.distributeInventory();
            $scope.findEnabledItems();
            $scope.determinePossibleRecipies();
        };

        $scope.getRememberalia = function (choice) {


            console.log(choice);


            choice.ingredients.forEach(function (ingredient) {


                var item = $scope.getItemFromInventory(ingredient.name);
                var newAmount = item.amount - ingredient.amount;
                if (newAmount === 0) {
                    $scope.removeFromInventory(ingredient.name);
                } else {
                    $scope.user.inventory[ingredient.name] = {name: ingredient.name, amount: newAmount};
                }
            }, this);

            $scope.addItem(choice);

            $scope.determinePossibleRecipies();
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