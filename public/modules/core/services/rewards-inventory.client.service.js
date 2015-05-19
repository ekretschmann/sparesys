'use strict';

angular.module('core').service('RewardsInventoryService', [
    function () {

        this.rewards = [];
        this.inventory = [];
        this.possibeRecipies = [];


        this.getUserItems = function() {
            var result = [];
            this.inventory.forEach(function(item) {
                if (this.getType(item) !== 'Skill') {
                    result.push(item);
                }
            }, this);
            return result;
        };

        this.getUserSkills = function() {
            var result = [];
            this.inventory.forEach(function(item) {
                if (this.getType(item) === 'Skill') {
                    result.push(item);
                }
            }, this);
            return result;
        };

        this.getType = function(item) {
            var result;
            this.rewards.forEach(function (reward) {
                if (item.rewardId === reward._id) {
                    result = reward.type;
                }
            }, this);
            return result;
        };

        this.getEnabledItems = function() {
            var ids = [];
            var result = [];
            this.rewards.forEach(function(reward) {
                this.inventory.forEach(function(item) {
                    if (item.rewardId === reward._id) {
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

        this.calculatePossibleRecipies = function() {
            var possibleRecipes = [];

            this.rewards.forEach(function (reward) {

                var possible = true;


                if (reward.ingredients) {
                    reward.ingredients.forEach(function (ingredient) {

                        //console.log(ingredient);
                        var found = false;
                        this.inventory.forEach(function (item) {
                            if (item.rewardId === ingredient._id && item.amount >= ingredient.amount) {
                                found = true;
                            }
                        });
                        if (!found) {
                            possible = false;
                        }

                    }, this);
                    if (possible) {
                        this.possibeRecipies.push(reward);
                    }
                }
            }, this);
        };

    }
]);
