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

        //
        //
        //$scope.getName= function(id) {
        //
        //    console.log('calling');
        //    var name = 'unknown';
        //    $scope.rewards.forEach(function(reward) {
        //        if (reward._id === id) {
        //            name = reward.name;
        //        }
        //    });
        //    $scope.name = name;
        //    return name;
        //};

        $scope.selectEnabler = function () {


            var found = false;
            $scope.ingredients.forEach(function (ingredient) {
                if (ingredient._id === $scope.selectedEnabler) {
                    found = true;
                }
            });


            if (!found) {
                $scope.rewards.forEach(function (reward) {
                    if (reward.name === $scope.selectedEnabler) {
                        $scope.enables.push(reward);
                        //if(!$scope.reward.enables) {
                        //    $scope.reward.enables = [];
                        //}
                        //$scope.reward.enables.push(reward._id);
                        //console.log($scope.reward);
                    }
                });

                //$scope.enables.push($scope.selectedEnabler);
            }

            $scope.selectedEnabler = '';
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

            //var reward = $scope.reward;
            //if (!$scope.updateReward) {
            //    reward = new Rewards({
            //        name: this.name
            //    });
            //    $scope.rewards.push(reward);
            //}
            //
            //reward.name = $scope.name;
            //reward.ingredients = [$scope.ingredients];
            //reward.enables = [];
            //reward.goals = [];
            //reward.defaulthealthpoints = $scope.defaulthealthpoints;
            //
            //$scope.enables.forEach(function(en) {
            //    reward.enables.push(en._id);
            //}, this);
            //
            //$scope.goals.forEach(function(en) {
            //    reward.goals.push(en._id);
            //}, this);
            //
            //reward.description = $scope.description;
            //reward.type = $scope.type;
            //if (reward.ingredients && reward.ingredients[0] && reward.ingredients[0].length > 0) {
            //    reward.type = 'Recipe';
            //} else {
            //    reward.type = $scope.type;
            //}
            //
            //
            //// Redirect after save
            //if ($scope.updateReward) {
            //    reward.$update(function () {
            //        $state.go($state.$current, null, {reload: true});
            //    });
            //} else {
            //    reward.$save(function (response) {
            //        //$location.path('rewards/' + response._id);
            //
            //        // Clear form fields
            //        $scope.name = '';
            //        $scope.type = 'Item';
            //        $scope.ingredients = [];
            //        $scope.updateReward = false;
            //        $scope.enables = [];
            //        $state.go($state.$current, null, {reload: true});
            //    }, function (errorResponse) {
            //        $scope.error = errorResponse.data.message;
            //    });
            //}
        };

        //$scope.removeAll = function() {
        //    $scope.rewards.forEach(function(reward) {
        //        $scope.remove(reward);
        //    });
        //};

        // Remove existing Reward
        //$scope.remove = function (reward) {
        //
        //    if (reward) {
        //        reward.$remove(function() {
        //            for (var i in $scope.rewards) {
        //
        //                if ($scope.rewards[i]._id === reward._id) {
        //                    $scope.rewards.splice(i, 1);
        //                }
        //            }
        //        });
        //
        //
        //    } else {
        //        $scope.reward.$remove(function () {
        //
        //        });
        //    }
        //    $scope.cancel();
        //};

        //$scope.getRewardNames = function () {
        //    $scope.rewardNames = [];
        //
        //    $scope.rewards.forEach(function (reward) {
        //        $scope.rewardNames[reward._id] = reward.name;
        //    }, this);
        //};

        //$scope.rewards = Rewards.query(function () {
        //    $scope.getRewardNames();
        //});

        $scope.find = function () {
            $scope.rewards = Rewards.query();
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

        //$scope.cancel = function () {
        //    $scope.name = '';
        //    $scope.description = '';
        //    $scope.type = 'Item';
        //    $scope.ingredients = [];
        //    $scope.enables = [];
        //    $scope.goals = [];
        //    $scope.selectedType = 'Item';
        //    $scope.updateReward = false;
        //    $scope.health = 1;
        //    $location.path('/rewards/manage/');
        //};
    }
]);
