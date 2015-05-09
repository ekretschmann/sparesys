'use strict';


// Courses controller
angular.module('core').controller('SelectRewardsController', ['$scope', '$state', '$document', 'Authentication', 'Users', 'Rewards',
    function ($scope, $state, $document, Authentication, Users, Rewards) {


        $scope.user = new Users($scope.authentication.user);
        $scope.recipies = [];
        $scope.rewards = [];

        $scope.skills = [];


        // these are Strings
        $scope.possibleItemOffers = [];
        $scope.possibleSkillOffers = [];

        $scope.offers = [];


        $scope.userItems = [];
        $scope.userSkills = [];
        $scope.userRecipies = [];
        $scope.rewardType = 'Items';


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


                    var isInInventory = $scope.getItemFromInventory(reward.name);

                    if (isInInventory) {
                        reward.enables.forEach(function (enabled) {
                            enabledItems.push(enabled);
                        });
                    }


                }

            }, this);

            $scope.possibleItemOffers = [];
            $scope.possibleSkillOffers = [];

            $scope.rewards.forEach(function (reward) {


                if (enabledItems.indexOf(reward.name) > -1) {
                    if (reward.type === 'Item') {
                        $scope.possibleItemOffers.push(reward);
                    }
                    if (reward.type === 'Skill') {
                        //only push if we don't have the skill
                        var found = false;
                        $scope.user.inventory.forEach(function(it) {
                            if (it.name === reward.name) {
                                found = true;
                            }
                        });

                        if (!found) {
                            $scope.possibleSkillOffers.push(reward);
                        }
                    }
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
                        if (item.name === ingredient.name && item.amount >= ingredient.amount) {
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



            var p = Math.random();
            var selectedOffers;
            if (p <0.3 && $scope.possibleSkillOffers.length > 0) {

                selectedOffers = $scope.possibleSkillOffers;
                $scope.rewardType = 'Skills';
            } else {

                selectedOffers = $scope.possibleItemOffers;
                $scope.rewardType = 'Items';

            }

            var indexes = [];
            var n = $scope.selectNumber(indexes, selectedOffers);
            if (n > -1) {
                indexes.push(n);
            }
            n = $scope.selectNumber(indexes, selectedOffers);
            if (n > -1) {
                indexes.push(n);
            }
            n = $scope.selectNumber(indexes, selectedOffers);
            if (n > -1) {
                indexes.push(n);
            }

            $scope.offers = [];
            if (selectedOffers.length > 0) {
                $scope.offers.push(selectedOffers[indexes[0]]);
            }
            if (selectedOffers.length > 1) {

                $scope.offers.push(selectedOffers[indexes[1]]);
            }
            if (selectedOffers.length > 2) {

                $scope.offers.push(selectedOffers[indexes[2]]);
            }


            // $scope.offers = ['soil', 'sapling', 'water'];


        };

        $scope.selectNumber = function (disallowed, selectedOffers) {

            if (disallowed.length >= selectedOffers.length) {
                return -1;
            }

            var result = Math.floor(Math.random() * selectedOffers.length);

            // try another
            if (disallowed.indexOf(result) > -1) {
                return $scope.selectNumber(disallowed, selectedOffers);
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