'use strict';

// Rewards controller
angular.module('rewards').controller('RewardsController', ['$scope', '$state', '$timeout', '$stateParams', '$location', '$modal', 'Authentication', 'Rewards',
    function ($scope, $state, $timeout, $stateParams, $location, $modal, Authentication, Rewards) {
        $scope.authentication = Authentication;

        $scope.ingredients = [];
        $scope.enables = [];
        $scope.enablesIds = [];
        $scope.goals = [];
        $scope.goalsIds = [];
        $scope.updateReward = false;
        $scope.type = 'Item';
        $scope.defaulthealthpoints = 1;

        $scope.selection = {};
        $scope.selection.ingredient = '';
        $scope.selection.enabler = '';
        $scope.selection.goal = '';



        $scope.getRewardName = function (rewardId) {
            for (var i = 0; i < $scope.rewards.length; i++) {
                if ($scope.rewards[i]._id === rewardId) {
                    return $scope.rewards[i].name;
                }
            }
        };

        $scope.getRewardId = function (rewardName) {
            for (var i = 0; i < $scope.rewards.length; i++) {
                if ($scope.rewards[i].name === rewardName) {
                    return $scope.rewards[i]._id;
                }
            }
        };

        $scope.removeIngredientFromReward = function (ingredient) {
            for (var i = 0; i < $scope.reward.ingredients.length; i++) {
                if ($scope.reward.ingredients[i].name === ingredient.name) {
                    $scope.reward.ingredients.splice(i, 1);
                }
            }
            $scope.reward.$update();
        };

        $scope.removeIngredient = function (ingredient) {
            for (var i = 0; i < $scope.ingredients.length; i++) {
                if ($scope.ingredients[i].name === ingredient.name) {
                    $scope.ingredients.splice(i, 1);
                }
            }
        };

        $scope.removePrecursor = function (precursor) {
            for (var i = 0; i < $scope.enables.length; i++) {
                if ($scope.enables[i] === precursor) {
                    $scope.enables.splice(i, 1);
                }
            }
        };

        $scope.removeGoal = function (goal) {
            for (var i = 0; i < $scope.goals.length; i++) {
                if ($scope.goals[i] === goal) {
                    $scope.goals.splice(i, 1);
                }
            }
        };

        $scope.removeGoalFromReward = function (goal) {

            for (var i = 0; i < $scope.reward.goals.length; i++) {

                if ($scope.reward.goals[i] === goal) {
                    $scope.reward.goals.splice(i, 1);
                }
            }

            $scope.reward.$update();

        };

        $scope.removePrecusorFromReward = function (precursor) {

            for (var i = 0; i < $scope.reward.enables.length; i++) {

                if ($scope.reward.enables[i] === precursor) {
                    $scope.reward.enables.splice(i, 1);
                }
            }

            $scope.reward.$update();

        };


        $scope.selectIngredient = function () {


            var rewardId;


            $scope.rewards.forEach(function (reward) {

                if (reward.name === $scope.selection.ingredient) {
                    rewardId = reward._id;
                }
            }, this);

            var found = false;
            $scope.ingredients.forEach(function (ingredient) {
                if (ingredient.name === $scope.selection.ingredient) {
                    ingredient.amount += 1;
                    found = true;
                }
            });


            if (!found) {
                $scope.ingredients.push({
                    rewardId: rewardId,
                    name: $scope.selection.ingredient,
                    amount: 1,
                    keep: false
                });

            }
            $scope.selection.ingredient = '';

        };


        $scope.selectIngredientForReward = function () {

            var rewardId;


            $scope.rewards.forEach(function (reward) {

                if (reward.name === $scope.selection.ingredient) {
                    rewardId = reward._id;
                }
            }, this);

            var found = false;


            $scope.reward.ingredients.forEach(function (ingredient) {
                console.log(ingredient.name + ' ' + $scope.selection.ingredient);
                if (ingredient.name === $scope.selection.ingredient) {
                    ingredient.amount += 1;
                    found = true;
                }
            });

            if (!found) {
                $scope.reward.ingredients.push({
                    rewardId: rewardId,
                    name: $scope.selection.ingredient,
                    amount: 1,
                    keep: false
                });
                // ;
            }
            $scope.reward.$update();
            $scope.selection.ingredient = '';
        };


        $scope.selectEnabler = function () {


            $scope.rewards.forEach(function (enabler) {
                if (enabler.name === $scope.selection.enabler) {

                    $scope.enables.push($scope.selection.enabler);
                    $scope.enablesIds.push(enabler._id);
                }
            });


            $scope.selection.enabler = '';
        };

        $scope.selectGoal = function () {

            $scope.rewards.forEach(function (goal) {
                if (goal.name === $scope.selection.goal) {

                    $scope.goals.push($scope.selection.goal);
                    $scope.goalsIds.push(goal._id);
                }
            });

            $scope.selection.goal = '';
        };

        $scope.selectGoalForReward = function () {

            var found = false;
            for (var i = 0; i < $scope.reward.goals.length; i++) {

                if ($scope.getRewardName($scope.reward.goals[i]) === $scope.selection.goal) {
                    found = true;
                }
            }

            if (!found) {
                $scope.reward.goals.push($scope.getRewardId($scope.selection.goal));
            }
            $scope.selection.goal = '';
            $scope.reward.$update();
        };

        $scope.selectEnablerForReward = function () {

            var found = false;
            for (var i = 0; i < $scope.reward.enables.length; i++) {

                if ($scope.getRewardName($scope.reward.enables[i]) === $scope.selection.enabler) {
                    found = true;
                }
            }

            if (!found) {
                $scope.reward.enables.push($scope.getRewardId($scope.selection.enabler));
            }
            $scope.selection.enabler = '';
            $scope.reward.$update();
        };

        $scope.areYouSureToDeleteReward = function (reward) {

            $scope.reward = reward;

            $modal.open({
                templateUrl: 'areYouSureToDeleteReward.html',
                controller: 'DeleteRewardController',
                resolve: {
                    reward: function () {
                        return $scope.reward;
                    }
                }
            }).result.then(function () {
                    $scope.rewards = Rewards.query();
                });


        };

        $scope.switchKeep = function (ingredient) {
            ingredient.keep = !ingredient.keep;
        };

        $scope.switchKeepForReward = function (ingredient) {
            ingredient.keep = !ingredient.keep;
            $scope.reward.$update();
        };

        $scope.update = function () {
            $scope.reward.$update();
        };

        $scope.updateSearch = function () {


            Rewards.query({
                text: $scope.options.searchText
            }, function (rewards) {
                $scope.rewards = rewards;

            });
        };

        // Create new Reward
        $scope.newReward = {};
        $scope.newReward.defaulthealthpoints = 1;
        $scope.newReward.type = 'Item';
        $scope.newReward.description = '';
        $scope.addReward = function () {
            // Create new Reward object


            var reward = new Rewards({
                name: $scope.newReward.name,
                healthpoints: $scope.newReward.defaulthealthpoints,
                type: $scope.newReward.type,
                ingredients: $scope.ingredients,
                goals: $scope.goalsIds,
                enables: $scope.enablesIds,
                description: $scope.newReward.description,
                price: $scope.newReward.price,
                basic: $scope.newReward.basic
            });

            reward.$save(function (response) {
                $scope.newReward.name = '';
                $scope.newReward.price = 1;
                $scope.newReward.defaulthealthpoints = 1;
                $scope.newReward.type = 'Item';
                $scope.newReward.description = '';
                $scope.ingredients = [];
                $scope.rewards.push(reward);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };


        $scope.find = function () {
            $scope.rewards = Rewards.query(function () {
                $scope.items = [];
                for (var i = 0; i < $scope.rewards.length; i++) {
                    //console.log($scope.rewards[i]);
                    if ($scope.rewards[i].type === 'Item') {
                        $scope.items.push($scope.rewards[i]);
                    }
                }
            });

        };

        $scope.findById = function (id) {
            Rewards.get({
                rewardId: id
            }, function (reward) {

                $scope.reward = reward;
            });

        };

        // Find existing Reward
        $scope.findOne = function () {

            if ($stateParams.rewardId) {

                Rewards.query(function (allRewards) {

                    $scope.rewards = allRewards;
                    $scope.items = [];
                    for (var i = 0; i < allRewards.length; i++) {
                        if (allRewards[i].type === 'Item') {
                            $scope.items.push(allRewards[i]);
                        }
                    }

                    for (i = 0; i < allRewards.length; i++) {
                        if (allRewards[i]._id === $stateParams.rewardId) {
                            $scope.reward = allRewards[i];


                        }
                    }

                });


            }


        };

    }
]);
