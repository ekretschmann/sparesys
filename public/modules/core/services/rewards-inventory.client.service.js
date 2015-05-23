'use strict';

angular.module('core').service('RewardsInventoryService', [
    function () {

        this.rewards = [];
        this.inventory = [];
        this.possibeRecipies = [];

        this.addRewardToInventory = function(reward) {

          //  var reward = this.getReward(item.rewardId);


            var found = false;
            this.inventory.forEach(function(piece) {
                if (piece.rewardId === reward._id) {
                    if(reward.type === 'Item') {
                        piece.amount += 1;

                    }
                    found = true;
                }
            });

            var healthpoints = reward.defaulthealthpoints;
            if(!healthpoints) {
                healthpoints = 1;
            }

            if (!found) {
                var item = {
                    name: reward.name,
                    rewardId: reward._id,
                    type: reward.type,
                    healthpoints: healthpoints,
                    amount: 1
                };
                this.inventory.push(item);
                //console.log('reward id: '+reward._id);
                //console.log('item     : '+item.rewardId);
            }
        };

        this.init = function(rewards, inventory) {
            this.rewards = rewards;
            this.inventory = inventory;

            // Making fire is a fundamental skill
            if (!this.inventory || this.inventory.length === 0) {

                this.rewards.forEach(function(reward) {
                    if (reward.name === 'Making Fire') {
                        this.inventory.push({name:'Making Fire', rewardId: reward._id, amount: 1, type: 'Skill', healthpoints: 1});
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

                        if (item.rewardId === ingredient.rewardId) {

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
                    this.inventory.push({name: reward.name, rewardId: reward._id, amount: 1, type: 'Item', healthpoints: reward.defaulthealthpoints});
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


        this.getSkillOffers = function() {
            var enabledItems = this.getEnabledItems();
            var result = [];
            enabledItems.forEach(function(item) {
                var found = false;
                this.inventory.forEach(function(inInventory) {
                    if (inInventory.rewardId === item._id) {
                        found = true;
                    }
                }, this);
                if (!found && item.type === 'Skill') {
                    result.push(item);
                }
            }, this);
            return result;
        };

        this.getItemOffers = function() {
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
            return result;
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
            this.possibeRecipies = [];

            this.rewards.forEach(function (reward) {

                var possible = true;



                if (reward.ingredients && reward.ingredients.length > 0) {

                    reward.ingredients.forEach(function (ingredient) {
                        var found = false;
                        this.inventory.forEach(function (item) {
                            if (item.rewardId === ingredient.rewardId && item.amount >= ingredient.amount) {
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
            return this.possibeRecipies;
        };

    }
]);
