'use strict';

angular.module('core').service('RewardsInventoryService', [
    function () {

        this.rewards = [];
        this.inventory = [];
        this.possibeRecipies = [];

        this.init = function(rewards, inventory) {
            this.rewards = rewards;
            this.inventory = inventory;

            // Making fire is a fundamental skill
            if (!this.inventory || this.inventory.length === 0) {

                this.rewards.forEach(function(reward) {
                    if (reward.name === 'Making Fire') {
                        this.inventory.push({rewardId: reward._id, amount: 1});
                    }
                }, this);
            }
        };

        this.trade = function (rewardId) {

            var reward = this.getReward(rewardId);
            var inventoryCopy = this.inventory.slice(0);
            var canTrade = true;
            if (reward.ingredients) {
                reward.ingredients.forEach(function (ingredient) {
                    var found = false;
                    inventoryCopy.forEach(function (item) {

                        if (item.rewardId === ingredient._id) {
                            for (var i = 0; i < ingredient.amount; i++) {
                                found = true;
                                if (item.healthpoints && item.healthpoints > 0) {
                                    item.healthpoints -= 1;
                                    if (item.healthpoints === 0) {
                                        item.amount -= 1;
                                        item.healthpoints = this.getReward(item.rewardId).defaulthealthpoints;
                                    }
                                } else {
                                    item.amount -= 1;
                                }
                            }
                        }
                    }, this);
                    if (!found) {
                        canTrade = false;
                    }
                }, this);
                if (canTrade) {
                    this.inventory = [];
                    inventoryCopy.forEach(function (item) {
                        if (item.amount > 0) {
                            this.inventory.push(item);
                        }
                    }, this);
                    this.inventory.push({rewardId: rewardId, amount: 1});
                }
            }
        };

        this.getReward = function (rewardId) {
            var result = {};
            this.rewards.forEach(function (reward) {
                if (reward._id === rewardId) {
                    result = reward;
                }
            }, this);
            return result;
        };

        this.getUserItems = function () {
            var result = [];
            this.inventory.forEach(function (item) {
                if (this.getType(item) !== 'Skill') {
                    result.push(item);
                }
            }, this);
            return result;
        };

        this.getUserSkills = function () {
            var result = [];
            this.inventory.forEach(function (item) {
                if (this.getType(item) === 'Skill') {
                    result.push(item);
                }
            }, this);
            return result;
        };

        this.getType = function (item) {
            var result;
            this.rewards.forEach(function (reward) {
                if (item.rewardId === reward._id) {
                    result = reward.type;
                }
            }, this);
            return result;
        };

        this.getNewItems = function() {
            var enabledItems = this.getEnabledItems();
            var result = [];
            enabledItems.forEach(function(item) {
                var found = false;
                this.inventory.forEach(function(inInventory) {
                      if (inInventory.rewardId === item._id) {
                          found = true;
                      }
                }, this);
                if (!found && item.type === 'Item') {
                    result.push(item);
                }
            }, this);
            console.log(result);
        };

        this.getEnabledItems = function () {
            var ids = [];
            var result = [];
            this.rewards.forEach(function (reward) {
                this.inventory.forEach(function (item) {
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
            this.rewards.forEach(function (reward) {
                if (ids.indexOf(reward._id) > -1) {
                    result.push(reward);
                }
            }, this);
            return result;
        };

        this.calculatePossibleRecipies = function () {
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
