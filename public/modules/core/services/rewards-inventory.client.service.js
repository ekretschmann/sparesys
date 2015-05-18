'use strict';

angular.module('core').service('RewardsInventoryService', [
    function () {

        this.rewards = [];
        this.inventory = [];


        this.getEnabledItems = function() {
            var ids = [];
            var result = [];
            this.rewards.forEach(function(reward) {
                this.inventory.forEach(function(item) {
                    if (item.reward === reward._id) {
                        if (reward.enables) {
                            reward.enables.forEach(function (id) {
                                if (ids.indexOf(id) === -1) {
                                    ids.push(id);
                                }
                            }, this);
                        }
                    }
                }, this);
            }, this);
            this.rewards.forEach(function(reward) {
                if(ids.indexOf(reward._id)>-1) {
                    result.push(reward);
                }
            }, this);
            return result;
        };

        this.getEnabledRecipies = function() {
            var possibleRecipes = [];

            this.recipies.forEach(function (recipe) {

                var possible = true;


                recipe.ingredients.forEach(function (ingredient) {

                    var found = false;
                    this.inventory.forEach(function (item) {
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

    }
]);
