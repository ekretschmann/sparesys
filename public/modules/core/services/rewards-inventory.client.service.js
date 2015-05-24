'use strict';

angular.module('core').service('RewardsInventoryService', [
    function () {

        this.rewards = [];
        this.inventory = [];
        this.possibeRecipies = [];
        this.usages = [];

        this.addRewardToInventory = function (rewardId) {


            var reward = this.getReward(rewardId);

            var found = false;
            this.inventory.forEach(function (piece) {


                if (piece.rewardId === reward._id) {

                    if (reward.type !== 'Skill') {
                        piece.amount += 1;

                    }
                    found = true;
                }
            });


            var healthpoints = reward.defaulthealthpoints;
            if (!healthpoints) {
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
            }
        };

        this.updateUsages = function() {

            this.inventory.forEach(function (item) {


                if (item.type === 'Skill') {

                    var reward = this.getReward(item.rewardId);
                    if (reward.enables) {
                        item.usedfor = 'Enables: ';

                        reward.enables.forEach(function (enabled) {

                            var theItem = this.getReward(enabled);

                            item.usedfor += theItem.name + ', ';
                        }, this);

                        item.usedfor = item.usedfor.substring(0, item.usedfor.length - 2);
                    }

                } else {
                    item.usedfor = 'Used for: ';

                    if (this.usages[item.name]) {
                        this.usages[item.name].forEach(function (usage) {
                            item.usedfor += usage.name + ', ';
                        });
                    }
                    item.usedfor = item.usedfor.substring(0, item.usedfor.length - 2);

                }

            }, this);

        };

        this.init = function (rewards, inventory) {
            this.rewards = rewards;
            this.inventory = inventory;
            this.usages = [];

            this.rewards.forEach(function (reward) {
                reward.ingredients.forEach(function (ingredient) {

                    var ingredientNames = '';
                    reward.ingredients.forEach(function (ingredient) {
                        ingredientNames += ingredient.amount + ' ' + ingredient.name + ', ';
                    }, this);
                    ingredientNames = ingredientNames.substring(0, ingredientNames.length - 2);

                    if (this.usages[ingredient.name]) {
                        this.usages[ingredient.name].push({name: reward.name, recipe: ingredientNames});
                    } else {
                        this.usages[ingredient.name] = [{name: reward.name, recipe: ingredientNames}];
                    }
                }, this);


            }, this);

            this.rewards.forEach(function (reward) {
                reward.usedfor = [];

                if (this.usages[reward.name]) {
                    this.usages[reward.name].forEach(function (usage) {
                        reward.usedfor.push(usage);
                    });
                }


            }, this);

            this.updateUsages();

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

                    this.addRewardToInventory(reward._id);
                    //this.inventory.push({name: reward.name, rewardId: reward._id, amount: 1, type: 'Item', healthpoints: reward.defaulthealthpoints});
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


        this.getSkillOffers = function () {
            var enabledItems = this.getEnabledItems();

            var result = [];
            // Making fire is a fundamental skill
            if (enabledItems.length === 0) {

                this.rewards.forEach(function (reward) {
                    if (reward.name === 'Making Fire') {
                        result.push(reward);
                    }
                }, this);
            } else {

                enabledItems.forEach(function (item) {
                    var found = false;
                    this.inventory.forEach(function (inInventory) {
                        if (inInventory.rewardId === item._id) {
                            found = true;
                        }
                    }, this);
                    if (!found && item.type === 'Skill') {
                        result.push(item);
                    }
                }, this);
            }
            return result;
        };

        this.getItemOffers = function () {


            var enabledItems = this.getEnabledItems();

            var result = [];
            enabledItems.forEach(function (item) {
                if (item.type === 'Item') {
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
