'use strict';

// Rewards controller
angular.module('rewards').controller('RewardsController', ['$scope', '$state', '$timeout', '$stateParams', '$location', '$modal', 'Authentication', 'Rewards',
    function ($scope, $state, $timeout, $stateParams, $location, $modal, Authentication, Rewards) {
        $scope.authentication = Authentication;

        $scope.ingredients = [];
        $scope.enables = [];
        $scope.goals = [];
        $scope.updateReward = false;
        $scope.type = 'Item';
        $scope.defaulthealthpoints = 1;

        $scope.selection = {};
        $scope.selection.ingredient = '';
        $scope.selection.enabler = '';
        $scope.selection.goal = '';

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

                if (reward.name === $scope.selectedIngredient) {
                    rewardId = reward._id;
                }
            }, this);

            var found = false;
            $scope.ingredients.forEach(function (ingredient) {
                if (ingredient.name === $scope.selectedIngredient) {
                    ingredient.amount += 1;
                    found = true;
                }
            });

            if (!found) {
                $scope.reward.ingredients.push({
                    rewardId: rewardId,
                    name: $scope.selectedIngredient,
                    amount: 1,
                    keep: false
                });
                $scope.reward.$update();
            }
            $scope.selectedIngredient = '';
        };



        $scope.selectEnabler = function () {


            var found = false;
            var rewardId = '';
            $scope.rewards.forEach(function (ingredient) {
                if (ingredient.name === $scope.selection.enabler) {
                    found = true;
                    rewardId = ingredient._id;
                }
            });

            if (found) {
                $scope.enables.push($scope.selection.enabler);

            }

            $scope.selection.enabler = '';
        };

        $scope.selectGoal = function () {


            var found = false;
            $scope.ingredients.forEach(function (ingredient) {
                if (ingredient._id === $scope.selectedGoal) {
                    found = true;
                }
            });


            if (!found) {
                $scope.rewards.forEach(function (reward) {
                    if (reward.name === $scope.selectedGoal) {
                        $scope.goals.push(reward);
                        //if(!$scope.reward.enables) {
                        //    $scope.reward.enables = [];
                        //}
                        //$scope.reward.enables.push(reward._id);
                        //console.log($scope.reward);
                    }
                });

                //$scope.enables.push($scope.selectedEnabler);
            }

            $scope.selectedGoal = '';
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
                enables: $scope.enables,
                description: $scope.newReward.description
            });

            reward.$save(function (response) {
                $scope.newReward.name = '';
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
            $scope.rewards = Rewards.query(function() {
                $scope.items = [];
                for (var i=0; i<$scope.rewards.length; i++) {
                    console.log($scope.rewards[i]);
                    if ($scope.rewards[i].type === 'Item') {
                        $scope.items.push($scope.rewards[i]);
                    }
                }
            });

        };

        // Find existing Reward
        $scope.findOne = function () {


            if ($stateParams.rewardId) {
                $scope.reward = Rewards.get({
                    rewardId: $stateParams.rewardId
                }, function (r) {
                    $scope.rewards = Rewards.query();
                });
            }


        };

    }
]);
