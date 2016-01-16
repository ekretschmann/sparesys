'use strict';

// Rewards controller
angular.module('rewards').controller('RewardsShopController', ['$scope', '$state', '$timeout', '$stateParams', '$location', '$modal',
    'Authentication', 'Rewards', 'Users',
    function ($scope, $state, $timeout, $stateParams, $location, $modal, Authentication, Rewards, Users) {
        $scope.authentication = Authentication;

        $scope.searchResult = [];
        $scope.searchText = '';

        $scope.items = {};
        $scope.items.forSale = [];
        $scope.items.owned = [];
        $scope.items.used = [];

        $scope.skills = {};
        $scope.skills.owned = [];
        $scope.skills.forSale = [];

        $scope.recipies = {};
        $scope.recipies.forSale = [];

        $scope.goals = {};
        $scope.goals.owned = [];
        $scope.goals.challenge = [];


        $scope.removeItemFromUser = function (item) {

            if (item.keep) {
                return;
            }

            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                var inventoryItem = $scope.authentication.user.inventory[i];
                if (inventoryItem.rewardId === item.rewardId) {
                    if (inventoryItem.healthpoints > item.amount) {
                        inventoryItem.healthpoints -= item.amount;
                    } else {
                        if (inventoryItem.amount === item.amount) {
                            $scope.authentication.user.inventory.splice(i, 1);
                        } else {
                            inventoryItem.amount -= item.amount;
                            inventoryItem.healthpoints = $scope.getReward(item.rewardId).defaulthealthpoints;
                        }
                    }
                }
            }
        };


        $scope.craft = function (reward) {

            for (var i = 0; i < reward.ingredients.length; i++) {
                $scope.removeItemFromUser(reward.ingredients[i]);
            }

            if (reward.journey && reward.journey !== '') {
                $scope.authentication.user.rewardlocation = reward.journey;
            } else {
                $scope.addItemToUser(reward);
            }

            $scope.updateUser();
            $scope.populateSkills();
            $scope.populateForSaleRewards();
            $scope.populateInventory();
            $scope.recipies.forSale = [];
            $scope.items.used = [];
        };

        $scope.calculateProducts = function () {
            $scope.recipies.forSale = [];
            for (var i = 0; i < $scope.rewards.length; i++) {
                var recipeFound = true;
                for (var j = 0; j < $scope.rewards[i].ingredients.length; j++) {
                    var item1 = $scope.rewards[i].ingredients[j];
                    var ingredientFound = false;
                    for (var k = 0; k < $scope.items.used.length; k++) {
                        var item2 = $scope.items.used[k];

                        if (item1.name === item2.name) {
                            ingredientFound = true;
                            if (item1.amount !== item2.amount) {
                                recipeFound = false;
                            }
                        }
                    }
                    if (!ingredientFound) {
                        recipeFound = false;
                    }
                }
                if (recipeFound && $scope.rewards[i].type === 'Recipe' && $scope.items.used.length === $scope.rewards[i].ingredients.length) {
                    $scope.recipies.forSale.push($scope.rewards[i]);
                }
            }
        };


        $scope.removeFromInventory = function (item) {

            for (var i = 0; i < $scope.items.owned.length; i++) {
                var inventoryItem = $scope.items.owned[i];
                if (inventoryItem.rewardId === item.rewardId) {
                    if (inventoryItem.amount === 1) {
                        $scope.items.owned.splice(i, 1);
                    } else {
                        inventoryItem.amount--;
                    }
                }
            }
        };

        $scope.addToInventory = function (item) {

            var found = false;
            for (var i = 0; i < $scope.items.owned.length; i++) {
                var usedItem = $scope.items.owned[i];
                if (usedItem.rewardId === item.rewardId) {
                    usedItem.amount++;
                    found = true;
                }
            }

            if (!found) {
                $scope.items.owned.push({
                    name: item.name,
                    rewardId: item.rewardId,
                    type: item.type,
                    healthpoints: item.healthpoints,
                    amount: 1
                });
            }
        };

        $scope.addToWorkbench = function (item) {

            var found = false;
            for (var i = 0; i < $scope.items.used.length; i++) {
                var usedItem = $scope.items.used[i];
                if (usedItem.rewardId === item.rewardId) {
                    usedItem.amount++;
                    found = true;
                }
            }

            if (!found) {
                $scope.items.used.push({
                    name: item.name,
                    rewardId: item.rewardId,
                    type: item.type,
                    healthpoints: item.healthpoints,
                    amount: 1
                });
            }
        };

        $scope.removeFromWorkbench = function (item) {
            for (var i = 0; i < $scope.items.used.length; i++) {
                var inventoryItem = $scope.items.used[i];

                if (inventoryItem.rewardId === item.rewardId) {
                    if (inventoryItem.amount === 1) {
                        $scope.items.used.splice(i, 1);
                    } else {
                        inventoryItem.amount--;
                    }
                }
            }
        };

        $scope.useIngredient = function (item) {
            $scope.removeFromInventory(item);
            $scope.addToWorkbench(item);
            $scope.calculateProducts();
        };

        $scope.unuseIngredient = function (item) {
            $scope.removeFromWorkbench(item);
            $scope.addToInventory(item);
            $scope.calculateProducts();
        };

        $scope.updateUser = function () {
            Users.get({
                userId: $scope.authentication.user._id
            }, function (user) {

                user.inventory = $scope.authentication.user.inventory;
                user.trophies = $scope.authentication.user.trophies;
                user.rewardlocation = $scope.authentication.user.rewardlocation;

                user.$update();
            });
        };


        $scope.purchaseSkill = function (reward) {

            function addSkill(skill) {
                var newItem = {
                    name: skill.name,
                    rewardId: skill._id,
                    type: skill.type,
                    healthpoints: skill.defaulthealthpoints,
                    amount: 1
                };
                $scope.authentication.user.inventory.push(newItem);
            }

            function hasSkill() {
                var found = false;
                for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                    if ($scope.authentication.user.inventory[i].rewardId === reward.rewardId) {
                        found = true;
                    }
                }
                return found;
            }

            if (!hasSkill(reward)) {
                addSkill(reward);
                $scope.updateUser();
                $scope.populateSkills();
                $scope.populateForSaleRewards();
            }

        };

        $scope.addItemToUser = function (item) {
            var reward = $scope.getUserItem(item);
            if (reward) {
                reward.amount++;
            } else {
                var newItem = {
                    name: item.name,
                    rewardId: item.rewardId,
                    type: item.type,
                    healthpoints: item.defaulthealthpoints,

                    amount: 1
                };
                $scope.authentication.user.inventory.push(newItem);
            }
        };

        $scope.getUserItem = function (reward) {
            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                if ($scope.authentication.user.inventory[i].rewardId === reward.rewardId) {
                    return $scope.authentication.user.inventory[i];
                }
            }
            return undefined;
        };

        $scope.purchaseItem = function (reward) {
            $scope.items.used = [];
            $scope.authentication.user.trophies -= reward.price;
            $scope.addItemToUser(reward);
            $scope.updateUser();
            $scope.populateSkills();
            $scope.populateForSaleRewards();
            $scope.populateInventory();
        };

        $scope.populateInventory = function () {

            $scope.items.owned = [];
            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                var item = $scope.authentication.user.inventory[i];
                if (item.type !== 'Skill') {
                    $scope.items.owned.push({
                        name: item.name,
                        rewardId: item.rewardId,
                        type: item.type,
                        healthpoints: item.healthpoints,
                        amount: item.amount
                    });

                }

            }
        };

        $scope.userHasReward = function (reward) {
            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                if ($scope.authentication.user.inventory[i].rewardId === reward.rewardId) {
                    return true;
                }
            }
            return false;
        };


        $scope.populateForSaleRewards = function () {
            $scope.items.forSale = [];
            $scope.skills.forSale = [];
            $scope.populateBasicItems();

            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                var item = $scope.authentication.user.inventory[i];
                var reward = $scope.getReward(item.rewardId);

                if (reward.type !== 'Item') {

                    if (reward.enables) {
                        for (var j = 0; j < reward.enables.length; j++) {
                            if (reward.enables[j].type === 'Skill') {
                                if (!$scope.userHasReward(reward.enables[j])) {
                                    $scope.skills.forSale.push(reward.enables[j]);
                                }
                            }
                            if (reward.enables[j].type === 'Item') {
                                if ($scope.authentication.user.rewardlocation === reward.enables[j].location ||
                                    reward.enables[j].location === 'Everywhere') {
                                    $scope.items.forSale.push($scope.getReward(reward.enables[j]._id));
                                }
                            }
                        }
                    }
                }
            }
        };

        $scope.replaceGenericIngredients = function () {


            function getGenericToSpecificMapping(rewards) {
                var result = [];
                for (var i = 0; i < rewards.length; i++) {
                    var candidateReward = rewards[i];
                    if (candidateReward.basis) {
                        if (!result[candidateReward.basis]) {
                            result[candidateReward.basis] = [];
                        }
                        result[candidateReward.basis].push(candidateReward);
                    }
                }
                return result;
            }

            function hasIngredient(reward, key) {
                for (var i = 0; i < reward.ingredients.length; i++) {
                    if (reward.ingredients[i].rewardId === key) {
                        return true;
                    }
                }
                return false;
            }


            function getListWithReplacements(key, ingredients, replacement) {
                var result = [];
                for (var i = 0; i < ingredients.length; i++) {
                    var candidate = ingredients[i];
                    if (candidate.rewardId === key) {
                        result.push({
                            rewardId: replacement.rewardId,
                            amount: candidate.amount,
                            keep: candidate.keep,
                            name: replacement.name
                        });
                    } else {
                        result.push(candidate);
                    }
                }
                return result;
            }

            function replaceIngredient(key, reward, genericToSpecific) {
                var result = [];
                var replacements = genericToSpecific[key];
                for (var i = 0; i < replacements.length; i++) {
                    var newIngredientList = getListWithReplacements(key, reward.ingredients, replacements[i]);
                    var newReward = {
                        'basic': reward.basic,
                        'basis': reward.basis,
                        'price': reward.price,
                        'defaulthealthpoints': reward.defaulthealthpoints,
                        'description': reward.description,
                        'ingredients': newIngredientList,
                        'goals': reward.goals,
                        'enables': reward.enables,
                        'location': reward.location,
                        'name': reward.name,
                        'journey': reward.journey,
                        'type': reward.type,
                        'rewardId': reward.rewardId
                    };
                    result.push(newReward);
                }

                return result;
            }

            function removeGenericIngredientsAndRecipes(recipeList, genericToSpecific) {
                var result = [];
                for (var i = 0; i < recipeList.length; i++) {
                    var recipe = recipeList[i];
                    if (genericToSpecific[recipe.rewardId]) {
                        continue;
                    }
                    var found = false;
                    for (var j = 0; j < recipe.ingredients.length; j++) {
                        var ingredient = recipe.ingredients[j];
                        if (genericToSpecific[ingredient.rewardId]) {
                            found = true;
                        }
                    }
                    if (!found) {
                        result.push(recipe);
                    }
                }
                return result;
            }

            function hasRecipe(recipe, recipeList) {
                for (var i = 0; i < recipeList.length; i++) {
                    if (recipe.rewardId === recipeList[i].rewardId) {
                        return true;
                    }
                }
                return false;
            }

            var genericToSpecific = getGenericToSpecificMapping($scope.rewards);
            var keys = Object.keys(genericToSpecific);

            var recipeList = [];
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                for (var j = 0; j < $scope.rewards.length; j++) {
                    var recipe = $scope.rewards[j];
                    if (hasIngredient(recipe, key)) {
                        var newRecipies = replaceIngredient(key, recipe, genericToSpecific);
                        recipeList = recipeList.concat(newRecipies);
                    } else {
                        if (!hasRecipe(recipe, recipeList)) {
                            recipeList.push(recipe);
                        }
                    }
                }
                $scope.rewards = recipeList;
            }
            $scope.rewards = removeGenericIngredientsAndRecipes(recipeList, genericToSpecific);
        };

        $scope.getReward = function (rewardId) {
            var result = {};
            $scope.rewards.forEach(function (reward) {
                if (reward.rewardId === rewardId) {
                    result = reward;
                }
            }, this);
            return result;
        };

        $scope.populateSkills = function () {

            $scope.goals.owned = [];
            $scope.goals.challenge = [];
            $scope.skills.owned = [];
            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                var item = $scope.authentication.user.inventory[i];


                var reward = $scope.getReward(item.rewardId);


                if (reward.type === 'Skill') {
                    $scope.skills.owned.push(item);
                    for (var j = 0; j < reward.goals.length; j++) {

                        var found = false;
                        for (var k = 0; k < $scope.authentication.user.inventory.length; k++) {
                            if ($scope.authentication.user.inventory[k].rewardId === reward.goals[j]._id) {
                                found = true;
                            }
                        }
                        if (found) {
                            $scope.goals.owned.push(reward.goals[j]);
                        } else {
                            $scope.goals.challenge.push(reward.goals[j]);
                        }
                    }
                }
            }

        };

        $scope.populateBasicItems = function () {
            for (var i = 0; i < $scope.rewards.length; i++) {
                if ($scope.rewards[i].basic) {
                    if ($scope.rewards[i].type === 'Skill') {
                        if (!$scope.userHasReward($scope.rewards[i])) {
                            $scope.skills.forSale.push($scope.rewards[i]);
                        }
                    } else {
                        $scope.items.forSale.push($scope.rewards[i]);
                    }
                }
            }
        };

        $scope.find = function () {



            Rewards.query(function (rewards) {

                $scope.rewards = [];

                for (var i = 0; i < rewards.length; i++) {

                    var reward = rewards[i];

                    $scope.rewards.push({
                        'basic': reward.basic,
                        'basis': reward.basis,
                        'price': reward.price,
                        'goals': reward.goals,
                        'enables': reward.enables,
                        'defaulthealthpoints': reward.defaulthealthpoints,
                        'description': reward.description,
                        'ingredients': reward.ingredients,
                        'location': reward.location,
                        'name': reward.name,
                        'type': reward.type,
                        'journey': reward.journey,
                        'rewardId': reward._id
                    });
                }
                $scope.replaceGenericIngredients();
                $scope.populateSkills();
                $scope.populateForSaleRewards();
                $scope.populateInventory();
            });
        };

        $scope.search = function (text) {
            $scope.searchText = text;
            $scope.updateSearch();
        };

        $scope.updateSearch = function () {


            $scope.searchResult = [];
            for (var i = 0; i < $scope.rewards.length; i++) {
                var rewardName = $scope.rewards[i].name;
                if (rewardName.toLowerCase().trim().indexOf($scope.searchText.toLowerCase().trim()) > -1) {
                    $scope.searchResult.push($scope.rewards[i]);
                }
            }


        };


        $scope.getHealthPoints = function (item) {

            if (item.healthpoints > 5) {
                return new Array(5);
            }



            return new Array(item.healthpoints);
        };

        $scope.getInventoryHealthPoints = function (item) {

            if (item.healthpoints > 5) {
                return new Array(5);
            }

            for (var i=0; i<$scope.items.used.length; i++) {
                var usedItem = $scope.items.used[i];
                if (usedItem.rewardId === item.rewardId) {
                    return new Array($scope.getReward(item.rewardId).defaulthealthpoints);
                }
            }

            return new Array(item.healthpoints);
        };

    }
]);
