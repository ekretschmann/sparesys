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
        $scope.recipies = {};
        $scope.recipies.forSale = [];
        $scope.find = function () {


            $scope.rewards = Rewards.query(function () {
                for (var i = 0; i < $scope.rewards.length; i++) {

                    if ($scope.rewards[i].basic) {

                        if ($scope.authentication.user.inventory.indexOf($scope.rewards[i]._id) === -1) {
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


            console.log('finding items');

            for (var i = 0; i < $scope.authentication.user.inventory.length; i++) {
                var item = $scope.authentication.user.inventory[i];
                if (item.type !== 'Skill') {
                    $scope.items.owned.push(item);
                }
                if (item.type === 'Skill') {
                    $scope.skills.owned.push(item);
                }
            }

            // find items
            for (i = 0; i < $scope.authentication.user.inventory.length; i++) {
                for (var j = 0; j < $scope.rewards.length; j++) {

                    if ($scope.authentication.user.inventory[i].rewardId === $scope.rewards[j]._id) {

                        if ($scope.rewards[j].type === 'Skill') {

                            console.log($scope.rewards[j]);
                            for (var k = 0; k < $scope.rewards.length; k++) {
                                if ($scope.rewards[j].enables.indexOf($scope.rewards[k]._id) !== -1) {
                                    $scope.items.forSale.push($scope.rewards[k]);
                                }
                            }
                        }
                    }
                }
            }


            //for (i = 0; i < $scope.rewards.length; i++) {
            //    if ($scope.rewards[i].type === 'Recipe') {
            //        for (j=0; j<$scope.rewards[i].ingredients.length; j++) {
            //
            //        }
            //    }
            //
            //}


        };


        $scope.purchase = function (item) {
            if ($scope.authentication.user.trophies > item.price) {
                // console.log(item);

                console.log($scope.authentication.user.inventory);

                console.log(item);

                var newItem = {
                    name: item.name,
                    rewardId: item._id,
                    type: item.type,
                    healthpoints: item.healthpoints,
                    amount: 1
                };


                Users.get({
                    userId: $scope.authentication.user._id
                }, function (user) {
                    user.inventory.push(newItem);
                    user.trophies -= item.price;

                    user.$update(function (updatedUser) {
                        $scope.authentication.user = updatedUser;
                        $state.go($state.$current, null, {reload: true});
                    });
                });
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
