'use strict';

// Rewards controller
angular.module('rewards').controller('RewardsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Rewards',
    function ($scope, $state, $stateParams, $location, Authentication, Rewards) {
        $scope.authentication = Authentication;

        $scope.ingredients = [];
        $scope.enables = [];
        $scope.rank = 1;
        $scope.updateReward = false;
        $scope.type = 'Item';

        $scope.selectedIngredient = '';
        $scope.selectedEnabler = '';


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

        $scope.selectIngredient = function () {


            var found = false;
            $scope.ingredients.forEach(function (ingredient) {
                if (ingredient.name === $scope.selectedIngredient) {
                    ingredient.amount += 1;
                    found = true;
                }
            });

            if (!found) {
                $scope.ingredients.push({name: $scope.selectedIngredient, amount: 1});

            }
            $scope.selectedIngredient = '';
        };


        $scope.selectEnabler = function () {


            var found = false;
            $scope.ingredients.forEach(function (ingredient) {
                if (ingredient._id === $scope.selectedEnabler) {
                    found = true;
                }
            });



            if (!found) {
                $scope.rewards.forEach(function(reward) {
                   if (reward.name === $scope.selectedEnabler) {
                       $scope.enables.push(reward);
                       $scope.reward.enables.push(reward._id);
                   }
                });

                //$scope.enables.push($scope.selectedEnabler);
            }

            $scope.selectedEnabler = '';
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

            reward.name = $scope.name;
            reward.ingredients = $scope.ingredients;
            reward.enables = $scope.enables;
            reward.description = $scope.description;
            reward.type = $scope.type;
            if (!reward.ingredients || reward.ingredients.length > 0) {
                reward.type = 'Recipe';
            } else {
                reward.type = $scope.type;
            }


            // Redirect after save
            if ($scope.updateReward) {
                reward.$update(function () {
                    $state.go($state.$current, null, {reload: true});
                });
            } else {
                reward.$save(function (response) {
                    //$location.path('rewards/' + response._id);

                    // Clear form fields
                    $scope.name = '';
                    $scope.type = 'Item';
                    $scope.ingredients = [];
                    $scope.updateReward = false;
                    $scope.enables = [];
                    $state.go($state.$current, null, {reload: true});
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

                    if ($scope.rewards[i]._id === reward._id) {
                        $scope.rewards.splice(i, 1);
                    }
                }
            } else {
                $scope.reward.$remove(function () {

                });
            }
            $scope.cancel();
        };

        $scope.rewards = Rewards.query();

        // Find existing Reward
        $scope.findOne = function () {

            if ($stateParams.rewardId) {
                $scope.reward = Rewards.get({
                    rewardId: $stateParams.rewardId
                }, function (r) {
                    $scope.name = r.name;
                    $scope.description = r.description;
                    $scope.type = r.type;
                    $scope.ingredients = r.ingredients;
                    $scope.selectedType = r.type;
                    $scope.updateReward = true;
                    console.log(r.enables);
                    $scope.rewards.forEach(function (reward) {
                        //console.log(reward._id);
                        //console.log(r.enables);
                        if (r.enables.indexOf(reward._id) > -1) {
                            //console.log('xxxxx' +reward);
                            $scope.enables.push(reward);
                        }
                    });
                });
            }


        };

        $scope.cancel = function () {
            $scope.name = '';
            $scope.description = '';
            $scope.type = 'Item';
            $scope.ingredients = [];
            $scope.enables = [];
            $scope.selectedType = 'Item';
            $scope.updateReward = false;
            $location.path('/rewards/manage/');
        };
    }
]);