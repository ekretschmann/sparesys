'use strict';

// Rewards controller
angular.module('rewards').controller('RewardsShopController', ['$scope', '$state', '$timeout', '$stateParams', '$location', '$modal',
    'Authentication', 'Rewards', 'Users',
    function ($scope, $state, $timeout, $stateParams, $location, $modal, Authentication, Rewards, Users) {
        $scope.authentication = Authentication;

        $scope.items = {};
        $scope.skills = {};
        $scope.items.forSale = [];
        $scope.items.owned = [];
        $scope.skills.owned = [];
        $scope.skills.forSale = [];
        $scope.recipies = {};
        $scope.recipies.forSale = [];

        $scope.searchResult = [];

        $scope.hasIngredients = [];

       // $scope.hasIngredients['Water'] = 2;

        //$scope.hasIngredients = function(reward) {
        //
        //    return false;
        //};

        $scope.search = function(text) {
            $scope.options.searchText = text;
            $scope.updateSearch();

        };

        $scope.updateSearch = function () {


            Rewards.query({
                text: $scope.options.searchText
            }, function (rewards) {
                $scope.searchResult = rewards;

                // enriching data
                //for (var i = 0; i<$scope.searchResult.length; i++) {
                //    var result = $scope.searchResult[i];
                //    for (var j=0; j<results.enables.length; j++) {
                //
                //    }
                //}

            });
        };

        $scope.updateIngredientArray = function() {
            for( var i=0; i<$scope.authentication.user.inventory.length; i++) {
                $scope.hasIngredients[$scope.authentication.user.inventory[i].name] = $scope.authentication.user.inventory[i].amount;
            }
        };

        $scope.find = function () {



            $scope.rewards = Rewards.query(function () {
                for (var i = 0; i < $scope.rewards.length; i++) {

                    if ($scope.rewards[i].basic) {

                        var found = false;
                        for( var j=0; j<$scope.authentication.user.inventory.length; j++) {
                            if ($scope.authentication.user.inventory[j].rewardId === $scope.rewards[i]._id) {
                                found = true;
                            }
                        }


                        if ($scope.rewards[i].type === 'Skill') {
                            if (!found) {
                                $scope.skills.forSale.push($scope.rewards[i]);
                            }
                        } else {
                            $scope.items.forSale.push($scope.rewards[i]);
                        }
                    }
                }

                $scope.findItems();

            });

        };

        $scope.getSkills = function () {

            var skills = [];

            for (var i = 0; i < $scope.rewards.length; i++) {
                if ($scope.authentication.user.inventory.indexOf($scope.rewards[i]._id) > -1) {
                    if ($scope.rewards[i].type === 'Skill') {
                        skills.push($scope.rewards[i]);
                    }
                }
            }
            return skills;

        };

        $scope.findItems = function () {

            $scope.items.owned = [];
            $scope.skills.owned = [];
            $scope.recipies.forSale = [];
            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                var item = $scope.authentication.user.inventory[i];
                if (item.type !== 'Skill') {
                    $scope.items.owned.push(item);
                }
                if (item.type === 'Skill') {
                    $scope.skills.owned.push(item);
                }
            }


            $scope.findForSaleItems();


            for (i = 0; i < $scope.rewards.length; i++) {
                if ($scope.rewards[i].type === 'Recipe') {

                    var found = 0;
                    for (var j=0; j<$scope.rewards[i].ingredients.length; j++) {

                        for (var k = 0; k < $scope.authentication.user.inventory.length; k++) {
                         //   console.log('  '+$scope.authentication.user.inventory[k]);
                            if ($scope.authentication.user.inventory[k].rewardId === $scope.rewards[i].ingredients[j].rewardId) {
                                if ($scope.rewards[i].ingredients[j].amount <= $scope.authentication.user.inventory[k].amount) {
                                    found++;
                                }
                            }
                        }
                    }
                    if (found === $scope.rewards[i].ingredients.length) {
                        $scope.recipies.forSale.push($scope.rewards[i]);
                    }
                }

            }

            $scope.updateIngredientArray();


        };

        $scope.findForSaleItems = function () {
            $scope.items.forSale = [];
            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                for (var j = 0; j < $scope.rewards.length; j++) {

                    if ($scope.authentication.user.inventory[i].rewardId === $scope.rewards[j]._id) {

                        if ($scope.rewards[j].type === 'Skill') {
                            for (var k = 0; k < $scope.rewards.length; k++) {
                                if ($scope.rewards[j].enables.indexOf($scope.rewards[k]._id) !== -1) {
                                    $scope.items.forSale.push($scope.rewards[k]);
                                }
                            }
                        }
                    }
                }
            }
        };


        $scope.craft = function (item) {



            for(var i=0; i< item.ingredients.length; i++) {
                var ingredient = item.ingredients[i];
                for (var j=0; j<$scope.authentication.user.inventory.length; j++) {
                    var inventoryItem = $scope.authentication.user.inventory[j];
                    if (inventoryItem.rewardId === ingredient.rewardId) {
                        inventoryItem.amount -= ingredient.amount;
                        if (inventoryItem.amount === 0) {
                            $scope.authentication.user.inventory.splice(j,1);
                        }
                    }
                }
            }


            var found = false;
            for (i=0; i< $scope.authentication.user.inventory.length; i++) {
                if($scope.authentication.user.inventory[i].rewardId === item._id) {
                    $scope.authentication.user.inventory[i].amount++;
                    found = true;
                }
            }


            if (!found) {
                var newItem = {
                    name: item.name,
                    rewardId: item._id,
                    type: item.type,
                    healthpoints: item.healthpoints,
                    amount: 1
                };

                $scope.authentication.user.inventory.push(newItem);
            }

            $scope.findItems();

            Users.get({
                userId: $scope.authentication.user._id
            }, function (user) {

                user.inventory= $scope.authentication.user.inventory;
                user.trophies = $scope.authentication.user.trophies;

                user.$update();
            });

        };

        $scope.purchase = function (item) {
            if ($scope.authentication.user.trophies > item.price) {


                var found = false;
                for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                    if ($scope.authentication.user.inventory[i].name === item.name) {
                        found = true;
                        var index = i;

                    }
                }

                if (found) {
                    Users.get({
                        userId: $scope.authentication.user._id
                    }, function (user) {

                        //console.log(index);
                        //console.log(user.inventory[index]);
                        user.inventory[index].amount++;
                        user.trophies -= item.price;

                        user.$update(function (updatedUser) {
                            $scope.authentication.user.inventory[index].amount++;
                            $scope.authentication.user.trophies -= item.price;


                        });
                    });
                    return;
                }

                var newItem = {
                    name: item.name,
                    rewardId: item._id,
                    type: item.type,
                    healthpoints: item.healthpoints,
                    amount: 1
                };

                $scope.authentication.user.inventory.push(newItem);
                $scope.authentication.user.trophies -= item.price;

                Users.get({
                    userId: $scope.authentication.user._id
                }, function (user) {

                    user.inventory= $scope.authentication.user.inventory;
                    user.trophies = $scope.authentication.user.trophies;

                    user.$update();

                });
                $scope.findItems();
            }

        };
        //
        //// Find existing Reward
        //$scope.findOne = function () {
        //
        //    if ($stateParams.rewardId) {
        //
        //        Rewards.query(function (allRewards) {
        //
        //            $scope.rewards = allRewards;
        //            $scope.items = [];
        //            for (var i = 0; i < allRewards.length; i++) {
        //                if (allRewards[i].type === 'Item') {
        //                    $scope.items.push(allRewards[i]);
        //                }
        //            }
        //
        //            for (i = 0; i < allRewards.length; i++) {
        //                if (allRewards[i]._id ===  $stateParams.rewardId) {
        //                    $scope.reward = allRewards[i];
        //                }
        //            }
        //
        //        });
        //
        //
        //
        //    }
        //
        //
        //};

    }
]);
