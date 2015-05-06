'use strict';

// Rewards controller
angular.module('rewards').controller('RewardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rewards',
    function ($scope, $stateParams, $location, Authentication, Rewards) {
        $scope.authentication = Authentication;

        $scope.ingredients = [];
        $scope.selectedType = 'Cheap Item';
        $scope.rewardTypes = ['Cheap Item', 'Rare Item', 'Special Item', 'Common Skill', 'Rare Skill', 'Special Skill'];
        $scope.updateReward = false;


        $scope.selectType = function (type) {
            $scope.selectedType = type;
        };

        $scope.removeIngredient = function (ingredient) {
            for (var i = 0; i < $scope.ingredients.length; i++) {
                if ($scope.ingredients[i].name === ingredient.name) {
                    $scope.ingredients.splice(i, 1);
                }
            }
        };

        $scope.addIngredient = function (reward) {

            var found = false;
            $scope.ingredients.forEach(function (ingredient) {
                if (ingredient.name === reward.name) {
                    ingredient.amount += 1;
                    found = true;
                }
            });

            if (!found) {
                $scope.ingredients.push({name: reward.name, amount: 1, keep: false});
            }
        };

        // Create new Reward
        $scope.create = function () {
            // Create new Reward object
            var reward = $scope.reward;
            if (!$scope.updateReward) {
                reward = new Rewards({
                    name: this.name
                });
                $scope.rewards.push(reward);
            }

            reward.ingredients = $scope.ingredients;
            if (!reward.ingredients || reward.ingredients.length > 0) {
                reward.type = 'Recipe';
            } else {
                reward.type = $scope.selectedType;

            }


            // Redirect after save
            if ($scope.updateReward) {
                reward.$update();
            } else {
                reward.$save(function (response) {
                    //$location.path('rewards/' + response._id);

                    // Clear form fields
                    $scope.name = '';
                    $scope.ingredients = [];
                    $scope.updateReward = false;
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };

        // Remove existing Reward
        $scope.remove = function (reward) {
            if (reward) {
                reward.$remove();

                for (var i in $scope.rewards) {
                    if ($scope.rewards [i] === reward) {
                        $scope.rewards.splice(i, 1);
                    }
                }
            } else {
                $scope.reward.$remove(function () {

                });
            }
        };
        //
        //// Update existing Reward
        //$scope.update = function() {
        //	var reward = $scope.reward;
        //
        //	reward.$update(function() {
        //		$location.path('rewards/' + reward._id);
        //	}, function(errorResponse) {
        //		$scope.error = errorResponse.data.message;
        //	});
        //};
        //
        // Find a list of Rewards
        //$scope.find = function() {
        //	$scope.rewards = Rewards.query();
        //};
        //
        // Find existing Reward
        $scope.findOne = function () {

            if ($stateParams.rewardId) {
                $scope.reward = Rewards.get({
                    rewardId: $stateParams.rewardId
                }, function (r) {
                    $scope.name = r.name;
                    $scope.ingredients = r.ingredients;
                    $scope.selectedType = r.type;
                    $scope.updateReward = true;
                });
            }

            $scope.rewards = Rewards.query();

        };
    }
]);