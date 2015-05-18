'use strict';

angular.module('core').service('RewardsInventoryService', [
    function () {

        this.rewards = [];

        this.testInit = function(rewards) {
            this.rewards = rewards;

        };


        this.findEnabledItems = function() {

        };

        this.determinePossibleRecipies = function() {
            var possibleRecipes = [];

            this.recipies.forEach(function (recipe) {

                var possible = true;


                recipe.ingredients.forEach(function (ingredient) {

                    var found = false;
                    $scope.user.inventory.forEach(function (item) {
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
        }

    }
]);