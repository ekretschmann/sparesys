'use strict';

// Rewards controller
angular.module('rewards').controller('RewardsShopController', ['$scope', '$state', '$timeout', '$stateParams', '$location', '$modal',
    'Authentication', 'Rewards', 'Users',
    function ($scope, $state, $timeout, $stateParams, $location, $modal, Authentication, Rewards, Users) {
        $scope.authentication = Authentication;


        $scope.replaceGenericIngredients = function () {
            //function hasGenericBasis(reward) {
            //    return reward.basis;
            //}
            //
            //function hasGenericIngredient (reward, basis) {
            //    var found = false;
            //    for (var k = 0; k < reward.ingredients.length; k++) {
            //        if (reward.ingredients[k].rewardId === basis) {
            //            found = true;
            //        }
            //    }
            //    return found;
            //}
            //
            //function extendGenericRewards(reward) {
            //    for (var i = 0; i < $scope.rewards.length; i++) {
            //        var candidateReward = $scope.rewards[i];
            //
            //        if (hasGenericIngredient(candidateReward, reward.basis)) {
            //
            //            var newIngredientList = [];
            //
            //            for (var l = 0; l < candidateReward.ingredients.length; l++) {
            //                var ingredient = candidateReward.ingredients[l];
            //                if (ingredient.rewardId === reward.basis) {
            //
            //                    newIngredientList.push({
            //                        'amount': candidateReward.ingredients[l].amount,
            //                        'keep': candidateReward.ingredients[l].keep,
            //                        'name': reward.name,
            //                        'rewardId': reward._id
            //                    });
            //                } else {
            //                    newIngredientList.push(candidateReward.ingredients[l]);
            //                }
            //            }
            //
            //            var newReward = {
            //                'basic': candidateReward.basic,
            //                'defaulthealthpoints': candidateReward.defaulthealthpoints,
            //                'description': candidateReward.description,
            //                'ingredients': newIngredientList,
            //                'location': candidateReward.location,
            //                'name': candidateReward.name,
            //                'type': candidateReward.type
            //
            //            };
            //
            //            $scope.rewards.push(newReward);
            //
            //        }
            //    }
            //}


            //function getGenericIngredients(reward, genericToSpecific) {
            //    var result = [];
            //    for (var i=0; i<reward.ingredients.length; i++) {
            //        if(genericToSpecific[reward.ingredients[i].rewardId]) {
            //            result.push(reward.ingredients[i]);
            //        }
            //    }
            //    return result;
            //}

            //
            //function getNonGenericIngredients(reward, genericToSpecific) {
            //    var result = [];
            //    for (var i=0; i<reward.ingredients.length; i++) {
            //        if(!genericToSpecific[reward.ingredients[i].rewardId]) {
            //            result.push(reward.ingredients[i]);
            //        }
            //    }
            //    return result;
            //}

            //function splitGenericRecipies(rewards, genericToSpecific) {
            //    var result = [[],[]];
            //    for (var i=0; i<rewards.length; i++) {
            //        var found = false;
            //        for (var j=0; j<rewards[i].ingredients.length;j++) {
            //            if (genericToSpecific[rewards[i].ingredients[j].rewardId]) {
            //                found = true;
            //            }
            //        }
            //        if (found) {
            //            result[0].push(rewards[i]);
            //        } else {
            //            result[1].push(rewards[i]);
            //        }
            //    }
            //    return result;
            //}


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
                for (var i=0; i<ingredients.length; i++) {
                    var candidate = ingredients[i];

                    if (candidate.rewardId === key) {
                        result.push({rewardId: replacement._id, amount: candidate.amount, keep: candidate.keep, name: replacement.name});
                    } else {
                        result.push(candidate);
                    }


                }
                return result;
            }

            function replaceIngredient(key, reward, genericToSpecific) {


                var result = [];
                var replacements = genericToSpecific[key];
               // console.log(reward.name);
               // console.log(replacements);
                for (var i = 0; i < replacements.length; i++) {


                    var newIngredientList = getListWithReplacements(key, reward.ingredients, replacements[i]);



                    var newReward = {
                        'basic': reward.basic,
                        'defaulthealthpoints': reward.defaulthealthpoints,
                        'description': reward.description,
                        'ingredients': newIngredientList,
                        'location': reward.location,
                        'name': reward.name,
                        'type': reward.type

                    };

                  result.push(newReward);
                }

                return result;
            }

            function removeGenericIngredientsAndRecipes(recipeList, genericToSpecific) {
                var result = [];
                for (var i=0; i<recipeList.length; i++) {
                    var recipe = recipeList[i];
                    if (genericToSpecific[recipe._id]) {
                        continue;
                    }
                    var found = false;
                    for (var j=0; j<recipe.ingredients.length; j++) {
                        var ingredient = recipe.ingredients[j];
                        if(genericToSpecific[ingredient.rewardId]) {
                            found = true;
                        }
                    }
                    if (!found) {
                        result.push(recipe);
                    }
                }

                return result;
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
                        recipeList.push(recipe);
                    }
                }

                $scope.rewards = recipeList;

            }

            $scope.rewards = removeGenericIngredientsAndRecipes(recipeList, genericToSpecific);



           // console.log($scope.rewards);

            for (i=0; i<$scope.rewards.length;i++) {
                console.log(i,$scope.rewards[i].name);
                for (var k=0; k<$scope.rewards[i].ingredients.length; k++) {
                    console.log('   ',$scope.rewards[i].ingredients[k].name);
                }
            }


        };

        $scope.find = function () {

            Rewards.query(function (rewards) {

                $scope.rewards = rewards;

                $scope.replaceGenericIngredients();

                //console.log($scope.rewards);

                //  $scope.findItems();

                //  $scope.findBasicItems();


            });

        };


        //$scope.items = {};
        //$scope.skills = {};
        //$scope.items.forSale = [];
        //$scope.items.owned = [];
        //$scope.items.used = [];
        //$scope.skills.owned = [];
        //$scope.skills.forSale = [];
        //$scope.recipies = {};
        //$scope.recipies.forSale = [];
        //$scope.recipies.forSaleNames = [];
        //
        //$scope.goals = {};
        //$scope.goals.owned = [];
        //$scope.goals.challenge = [];
        //$scope.searchResult = [];
        //$scope.hasIngredients = [];


        //$scope.checkProduct = function () {
        //    $scope.recipies.forSale = [];
        //    for (var i = 0; i < $scope.rewards.length; i++) {
        //        var recipeFound = true;
        //        for (var j = 0; j < $scope.rewards[i].ingredients.length; j++) {
        //            var item1 = $scope.rewards[i].ingredients[j];
        //            var ingredientFound = false;
        //
        //            for (var k = 0; k < $scope.items.used.length; k++) {
        //                var item2 = $scope.items.used[k];
        //
        //                if (item1.name === item2.name) {
        //                    ingredientFound = true;
        //                    if (item1.amount !== item2.amount) {
        //                        recipeFound = false;
        //                    }
        //                }
        //            }
        //            if (!ingredientFound) {
        //
        //                recipeFound = false;
        //            }
        //        }
        //        if (recipeFound && $scope.rewards[i].type === 'Recipe' && $scope.items.used.length === $scope.rewards[i].ingredients.length) {
        //            $scope.recipies.forSale.push($scope.rewards[i]);
        //        }
        //    }
        //
        //};
        //
        //$scope.removeItemOwned = function (item) {
        //    for (var i = 0; i < $scope.items.owned.length; i++) {
        //        if ($scope.items.owned[i].name === item.name) {
        //            $scope.items.owned.splice(i, 1);
        //        }
        //    }
        //
        //};
        //
        //$scope.removeItemFromRecipe = function (item) {
        //    for (var i = 0; i < $scope.items.used.length; i++) {
        //        if ($scope.items.used[i].name === item.name) {
        //            $scope.items.used.splice(i, 1);
        //        }
        //    }
        //};
        //
        //$scope.useIngredient = function (item) {
        //
        //    item.amount--;
        //    if (item.amount === 0) {
        //        $scope.removeItemOwned(item);
        //    }
        //
        //    var found = false;
        //    for (var i = 0; i < $scope.items.used.length; i++) {
        //        if ($scope.items.used[i].name === item.name) {
        //            $scope.items.used[i].amount++;
        //            found = true;
        //        }
        //    }
        //
        //    if (!found) {
        //        $scope.items.used.push({
        //            _id: item._id,
        //            rewardId: item.rewardId,
        //            amount: 1,
        //            name: item.name,
        //            healthpoints: item.healthpoints
        //        });
        //    }
        //    $scope.checkProduct();
        //};
        //
        //$scope.removeFromRecipe = function (item) {
        //    item.amount--;
        //    if (item.amount === 0) {
        //        $scope.removeItemFromRecipe(item);
        //    }
        //
        //    var found = false;
        //    for (var i = 0; i < $scope.items.owned.length; i++) {
        //        if ($scope.items.owned[i].name === item.name) {
        //            $scope.items.owned[i].amount++;
        //            found = true;
        //        }
        //    }
        //
        //    if (!found) {
        //        $scope.items.owned.push({
        //            _id: item._id,
        //            rewardId: item.rewardId,
        //            amount: 1,
        //            name: item.name,
        //            healthpoints: item.healthpoints
        //        });
        //    }
        //    $scope.checkProduct();
        //};
        //
        //$scope.userHasReward = function (reward) {
        //    for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //        if ($scope.authentication.user.inventory[i].rewardId === reward._id) {
        //            return true;
        //        }
        //    }
        //    return false;
        //};
        //
        //$scope.search = function (text) {
        //    $scope.options.searchText = text;
        //    $scope.updateSearch();
        //
        //};
        //
        //$scope.updateSearch = function () {
        //
        //
        //    Rewards.query({
        //        text: $scope.options.searchText
        //    }, function (rewards) {
        //        $scope.searchResult = rewards;
        //
        //
        //    });
        //};
        //
        //$scope.updateIngredientArray = function () {
        //    for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //        $scope.hasIngredients[$scope.authentication.user.inventory[i].name] = $scope.authentication.user.inventory[i].amount;
        //    }
        //};
        //
        //
        //$scope.getReward = function (rewardId) {
        //    var result = {};
        //    $scope.rewards.forEach(function (reward) {
        //        if (reward._id === rewardId) {
        //            result = reward;
        //        }
        //    }, this);
        //    return result;
        //};
        //
        //$scope.findBasicItems = function () {
        //    for (var i = 0; i < $scope.rewards.length; i++) {
        //
        //
        //        if ($scope.rewards[i].basic) {
        //
        //
        //            if ($scope.rewards[i].type === 'Skill') {
        //                if (!$scope.userHasReward($scope.rewards[i])) {
        //                    $scope.skills.forSale.push($scope.rewards[i]);
        //                }
        //            } else {
        //
        //                $scope.items.forSale.push($scope.rewards[i]);
        //                $scope.items.forSaleNames.push($scope.rewards[i].name);
        //            }
        //        }
        //    }
        //};
        //
        //
        //
        //$scope.getSkills = function () {
        //
        //    var skills = [];
        //
        //    for (var i = 0; i < $scope.rewards.length; i++) {
        //        if ($scope.authentication.user.inventory.indexOf($scope.rewards[i]._id) > -1) {
        //            if ($scope.rewards[i].type === 'Skill') {
        //                skills.push($scope.rewards[i]);
        //            }
        //        }
        //    }
        //    return skills;
        //
        //};
        //
        //
        //$scope.populateSkills = function () {
        //    $scope.goals.owned = [];
        //    $scope.goals.challenge = [];
        //    for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //        var item = $scope.authentication.user.inventory[i];
        //        var reward = $scope.getReward(item.rewardId);
        //        if (reward.type !== 'Skill') {
        //            $scope.items.owned.push(item);
        //        }
        //        if (reward.type === 'Skill') {
        //            $scope.skills.owned.push(reward);
        //            for (var j = 0; j < reward.goals.length; j++) {
        //
        //                var found = false;
        //                for (var k = 0; k < $scope.authentication.user.inventory.length; k++) {
        //                    if ($scope.authentication.user.inventory[k].rewardId === reward.goals[j]._id) {
        //                        found = true;
        //                    }
        //                }
        //                if (found) {
        //                    $scope.goals.owned.push(reward.goals[j]);
        //                } else {
        //                    $scope.goals.challenge.push(reward.goals[j]);
        //                }
        //
        //            }
        //
        //        }
        //    }
        //};
        //
        //
        //$scope.findItems = function () {
        //
        //    $scope.items.owned = [];
        //    $scope.skills.owned = [];
        //
        //    $scope.populateSkills();
        //    $scope.findForSaleItems();
        //    $scope.updateIngredientArray();
        //
        //
        //};
        //
        //$scope.getEnabledRewards = function (ids) {
        //    var enabled = [];
        //    for (var i = 0; i < ids.length; i++) {
        //        enabled.push($scope.getReward(ids[i]));
        //    }
        //
        //    return enabled;
        //};
        //
        //$scope.findForSaleItems = function () {
        //    $scope.items.forSale = [];
        //    $scope.skills.forSale = [];
        //    for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //        var item = $scope.authentication.user.inventory[i];
        //        var reward = $scope.getReward(item.rewardId);
        //
        //
        //        if (reward.type !== 'Item') {
        //
        //            if (reward.enables) {
        //                for (var j = 0; j < reward.enables.length; j++) {
        //                    if (reward.enables[j].type === 'Skill') {
        //                        if (!$scope.userHasReward(reward.enables[j])) {
        //                            $scope.skills.forSale.push($scope.getReward(reward.enables[j]._id));
        //                        }
        //                    }
        //                    if (reward.enables[j].type === 'Item') {
        //                        if ($scope.authentication.user.rewardlocation === reward.enables[j].location ||
        //                            reward.enables[j].location === 'Everywhere') {
        //
        //
        //                            $scope.items.forSale.push($scope.getReward(reward.enables[j]._id));
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //};
        //
        //
        //$scope.addItemToInventory = function(item) {
        //    var found = false;
        //
        //    for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //        // this should use rewardId
        //        if ($scope.authentication.user.inventory[i].name === item.name) {
        //            $scope.authentication.user.inventory[i].amount++;
        //            found = true;
        //        }
        //    }
        //
        //
        //    if (!found) {
        //        if (!item.journey || item.journey === '') {
        //
        //            var newItem = {
        //                name: item.name,
        //                rewardId: item._id,
        //                type: item.type,
        //                healthpoints: item.defaulthealthpoints,
        //                amount: 1
        //            };
        //
        //            $scope.authentication.user.inventory.push(newItem);
        //
        //
        //
        //        } else {
        //            $scope.authentication.user.rewardlocation = item.journey;
        //        }
        //    }
        //};
        //
        //$scope.addStableItemToInventory = function(item) {
        //
        //
        //    var found = false;
        //    for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //        var inventoryItem = $scope.authentication.user.inventory[i];
        //        if (inventoryItem.rewardId === item.rewardId) {
        //            inventoryItem.amount ++;
        //            inventoryItem.healthpoints = item.healthpoints;
        //            found = true;
        //        }
        //    }
        //    if (!found) {
        //        var newItem = {
        //            name: item.name,
        //            rewardId: item.rewardId,
        //            type: item.type,
        //            healthpoints: item.healthpoints,
        //            amount: 1
        //        };
        //
        //
        //        $scope.authentication.user.inventory.push(newItem);
        //
        //    }
        //};
        //
        //$scope.craft = function (item) {
        //
        //
        //
        //
        //    $scope.searchResult = [];
        //
        //
        //    for (var i = 0; i < item.ingredients.length; i++) {
        //        var ingredient = item.ingredients[i];
        //        if (ingredient.keep) {
        //
        //            var theReward = $scope.getReward(ingredient.rewardId);
        //            var oldItem = {
        //                name: ingredient.name,
        //                rewardId: ingredient.rewardId,
        //                type: theReward.type,
        //                healthpoints: ingredient.healthpoints,
        //                amount: 1
        //            };
        //             $scope.authentication.user.inventory.push(oldItem);
        //        }
        //
        //
        //
        //        for (var j = 0; j < $scope.authentication.user.inventory.length; j++) {
        //            var inventoryItem = $scope.authentication.user.inventory[j];
        //            if (inventoryItem.rewardId === ingredient.rewardId) {
        //
        //                if (inventoryItem.amount === 0) {
        //                    $scope.authentication.user.inventory.splice(j, 1);
        //                }
        //            }
        //        }
        //    }
        //    $scope.addItemToInventory(item);
        //
        //
        //    for (var k=0; k<$scope.items.used.length; k++) {
        //        var candidate = $scope.items.used[k];
        //
        //        if (candidate.healthpoints > 1) {
        //            candidate.healthpoints--;
        //            candidate.type = $scope.getReward(candidate.rewardId).type;
        //            $scope.addStableItemToInventory(candidate);
        //        }
        //    }
        //
        //    $scope.findItems();
        //
        //    Users.get({
        //        userId: $scope.authentication.user._id
        //    }, function (user) {
        //
        //        user.inventory = $scope.authentication.user.inventory;
        //        user.trophies = $scope.authentication.user.trophies;
        //        user.rewardlocation = $scope.authentication.user.rewardlocation;
        //
        //        for (var i=0; i<user.inventory.length; i++) {
        //            if (!user.inventory[i].amount || user.inventory[i].amount === 0) {
        //                user.inventory.splice(i,0);
        //            }
        //        }
        //
        //
        //        user.$update(function () {
        //            $scope.recipies.forSale = [];
        //            $scope.recipies.itemUsed = [];
        //            $scope.items.used = [];
        //        });
        //    });
        //
        //};
        //
        //$scope.resetRecipe = function() {
        //    for (var i = 0; i < $scope.items.used.length; i++) {
        //        var item = $scope.items.used[i];
        //        var found = false;
        //        for (var j=0; j< $scope.items.owned.length; j++) {
        //            var inInvetory = $scope.items.owned[j];
        //            if (item.rewardId === inInvetory.rewardId) {
        //                inInvetory.amount += item.amount;
        //                found = true;
        //            }
        //        }
        //        if(!found) {
        //            $scope.items.owned.push({
        //                _id: item._id,
        //                rewardId: item.rewardId,
        //                amount: item.amount,
        //                name: item.name,
        //                healthpoints: item.healthpoints
        //            });
        //        }
        //
        //    }
        //    $scope.items.used = [];
        //};
        //
        //$scope.purchase = function (item) {
        //   // $scope.resetRecipe();
        //
        //
        //    if ($scope.authentication.user.trophies > item.price) {
        //
        //
        //        var found = false;
        //        var index = -1;
        //        for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //
        //            if ($scope.authentication.user.inventory[i].name === item.name) {
        //                found = true;
        //                index = i;
        //            }
        //        }
        //
        //
        //
        //        if (found) {
        //
        //            for ( i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //                if ($scope.authentication.user.inventory[i].amount === 0) {
        //                    $scope.authentication.user.inventory.splice(i,1);
        //                }
        //            }
        //
        //            Users.get({
        //                userId: $scope.authentication.user._id
        //            }, function (user) {
        //
        //                user.inventory[index].amount++;
        //                user.trophies -= item.price;
        //
        //                for (var i=0; i<user.inventory.length; i++) {
        //                    if (!user.inventory[i].amount || user.inventory[i].amount === 0) {
        //                        user.inventory.splice(i,0);
        //                    }
        //                }
        //
        //                user.$update(function (updatedUser) {
        //                    //$scope.authentication.user.inventory[index].amount++;
        //                    //$scope.authentication.user.trophies -= item.price;
        //
        //                    $scope.authentication.user.inventory = updatedUser.inventory;
        //                    $scope.authentication.user.trophies = updatedUser.trophies;
        //
        //                });
        //            });
        //            $scope.findItems();
        //            $scope.findBasicItems();
        //            return;
        //        }
        //        //
        //        //
        //        //
        //        //
        //        var newItem = {
        //            name: item.name,
        //            rewardId: item._id,
        //            type: item.type,
        //            healthpoints: $scope.getReward(item._id).defaulthealthpoints,
        //            amount: 1
        //        };
        //        //
        //        $scope.authentication.user.inventory.push(newItem);
        //        $scope.authentication.user.trophies -= item.price;
        //
        //        for ( i = 0; i < $scope.authentication.user.inventory.length; i++) {
        //            if ($scope.authentication.user.inventory[i].amount === 0) {
        //                $scope.authentication.user.inventory.splice(i,1);
        //            }
        //        }
        //
        //        Users.get({
        //            userId: $scope.authentication.user._id
        //        }, function (user) {
        //
        //            user.inventory = $scope.authentication.user.inventory;
        //            user.trophies = $scope.authentication.user.trophies;
        //
        //
        //            for (var i=0; i<user.inventory.length; i++) {
        //                if (!user.inventory[i].amount || user.inventory[i].amount === 0) {
        //                    user.inventory.splice(i,0);
        //                }
        //            }
        //            user.$update();
        //
        //        });
        //        $scope.findItems();
        //        $scope.findBasicItems();
        //
        //    }
        //
        //};
        //
        //
        //$scope.getHealthPoints = function(item) {
        //
        //
        //    return new Array(item.healthpoints);
        //};

    }
]);
