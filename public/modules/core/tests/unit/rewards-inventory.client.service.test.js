'use strict';

(function () {
    describe('RewardsInventoryService', function () {
        //Initialize global variables
        var Service;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));



        beforeEach(inject(function (_RewardsInventoryService_) {
            Service = _RewardsInventoryService_;
        }));


        it('should not duplicate skills', function () {
            Service.rewards = testRewards.slice(0);

            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '3', amount: 1}];

            Service.addRewardToInventory({_id: '101', name: 'Some Skill', type: 'Skill', defaulthealthpoints: 1});
            expect(Service.inventory.length).toBe(3);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
        });

        it('should add item duplicate to inventory', function () {
            Service.rewards = testRewards.slice(0);

            Service.inventory = [{rewardId: '101'},
                {rewardId: '1', amount: 1},
                {rewardId: '3', amount: 1}];
            Service.addRewardToInventory({_id: '3', name: 'Some Item', type: 'Item', defaulthealthpoints: 1});
            expect(Service.inventory.length).toBe(3);
            expect(Service.inventory).toContain({rewardId: '3', amount: 2});
        });

        it('should add new item to inventory', function () {
            Service.rewards = testRewards.slice(0);

            Service.inventory = [{rewardId: '101'},
                {rewardId: '1', amount: 1},
                {rewardId: '3', amount: 1}];
            Service.addRewardToInventory({_id: '4', name: 'Some Item', type: 'Item', defaulthealthpoints: 1});
            expect(Service.inventory.length).toBe(4);
            expect(Service.inventory).toContain({name: 'Some Item', rewardId: '4', type:'Item', healthpoints: 1, amount: 1});
        });

        it('should get me correct skill offers', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({_id: '1005',
                    name: 'Tree',
                    type: 'Item',
                    ingredients: [{_id: '1', amount: 1}, {_id: '2', amount: 1}, {_id:'3', amount: 1}],
                    enables: ['102']
                }
            );

            Service.inventory = [{rewardId: '101'},
                {rewardId: '1', amount: 1},
                {rewardId: '3', amount: 1}];
            var itemOffers = Service.getSkillOffers();
            expect(itemOffers.length).toBe(1);
            expect(itemOffers).toContain({_id: '102', name: 'Making Fire', type: 'Skill', enables: ['2', '3', '4']});
        });

        it('should get me correct item offers', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({_id: '1005',
                    name: 'Tree',
                    type: 'Item',
                    ingredients: [{_id: '1', amount: 1}, {_id: '2', amount: 1}, {_id:'3', amount: 1}],
                    enables: ['2']
                }
            );

            Service.inventory = [{rewardId: '101'},
                {rewardId: '1', amount: 1},
                {rewardId: '3', amount: 1}];
            var itemOffers = Service.getItemOffers();
            expect(itemOffers.length).toBe(1);
            expect(itemOffers).toContain({_id: '2', name: 'Water', type: 'Item'});
        });

        it('should handle healthpoints for items when more than one is used and remove item', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({
                    _id: '5',
                    name: 'Tree',
                    type: 'Item',
                    ingredients:[{_id:'1', amount: 1}, {_id: '4', amount:4}, {_id:'3', amount:1}]
                }
            );
            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '4', amount: 4, healthpoints: 3},
                {rewardId: '3', amount: 1}
            ];
            Service.trade('5');

            //expect(Service.inventory.length).toBe(4);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
            expect(Service.inventory).toContain({rewardId: '5', amount: 1});
            expect(Service.inventory).toContain({rewardId: '4', amount: 3, healthpoints: 2});
        });

        it('should handle healthpoints for items when more than one is used', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({
                    _id: '5',
                    name: 'Tree',
                    type: 'Item',
                    ingredients:[{_id:'1', amount: 1}, {_id: '4', amount:2}, {_id:'3', amount:1}]
                }
            );
            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '4', amount: 4, healthpoints: 3},
                {rewardId: '3', amount: 1}
            ];
            Service.trade('5');

            //expect(Service.inventory.length).toBe(4);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
            expect(Service.inventory).toContain({rewardId: '5', amount: 1});
            expect(Service.inventory).toContain({rewardId: '4', amount: 4, healthpoints: 1});
        });

        it('should remove items when more than one is used', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({
                    _id: '5',
                    name: 'Tree',
                    type: 'Item',
                    ingredients:[{_id:'1', amount: 1}, {_id: '2', amount:2}, {_id:'3', amount:1}]
                }
            );
            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '2', amount: 4},
                {rewardId: '3', amount: 1}
            ];
            Service.trade('5');
            expect(Service.inventory.length).toBe(3);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
            expect(Service.inventory).toContain({rewardId: '5', amount: 1});
            expect(Service.inventory).toContain({rewardId: '2', amount: 2});
        });


        it('should remove an item with no healthpoints and use default health for next item', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({
                    _id: '5',
                    name: 'Tree',
                    type: 'Item',
                    ingredients:[{_id:'1', amount: 1}, {_id: '3', amount:1}, {_id:'4', amount:1}]
                }
            );
            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '4', amount: 2, healthpoints: 1},
                {rewardId: '3', amount: 1}
            ];
            Service.trade('5');
            expect(Service.inventory.length).toBe(3);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
            expect(Service.inventory).toContain({rewardId: '5', amount: 1});
            expect(Service.inventory).toContain({rewardId: '4', amount: 1, healthpoints: 3});
        });

        it('should remove an item with no healthpoints', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({
                    _id: '5',
                    name: 'Tree',
                    type: 'Item',
                    ingredients:[{_id:'1', amount: 1}, {_id: '2', amount:1}, {_id:'3', amount:1}]
                }
            );
            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '2', amount: 1, healthpoints: 1},
                {rewardId: '3', amount: 1}
            ];
            Service.trade('5');
            expect(Service.inventory.length).toBe(2);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
            expect(Service.inventory).toContain({rewardId: '5', amount: 1});
        });

        it('should reduce the healthpoints of ingredients', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({
                    _id: '5',
                    name: 'Tree',
                    type: 'Item',
                    ingredients:[{_id:'1', amount: 1}, {_id: '2', amount:1}, {_id:'3', amount:1}]
                }
            );
            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '2', amount: 1, healthpoints: 3},
                {rewardId: '3', amount: 1}
            ];
            Service.trade('5');
            expect(Service.inventory.length).toBe(3);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
            expect(Service.inventory).toContain({rewardId: '5', amount: 1});
            expect(Service.inventory).toContain({rewardId: '2', amount: 1, healthpoints: 2});

        });

        it('should keep items that are not fully used in trade', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({
                    _id: '5',
                    name: 'Tree',
                    type: 'Item',
                    ingredients:[{_id:'1', amount: 1}, {_id: '2', amount:1}, {_id:'3', amount:1}]
                }
            );
            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '2', amount: 2},
                {rewardId: '3', amount: 1}
            ];
            Service.trade('5');
            expect(Service.inventory.length).toBe(3);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
            expect(Service.inventory).toContain({rewardId: '5', amount: 1});
            expect(Service.inventory).toContain({rewardId: '2', amount: 1});

        });

        it('should serve simple item to item trades', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({
                    _id: '5',
                    name: 'Tree',
                    type: 'Item',
                    ingredients:[{_id:'1', amount: 1}, {_id: '2', amount:1}, {_id:'3', amount:1}]
                }
            );
            Service.inventory = [{rewardId: '101', amount: 1},
                {rewardId: '1', amount: 1},
                {rewardId: '2', amount: 1},
                {rewardId: '3', amount: 1}
            ];
            Service.trade('5');
            expect(Service.inventory.length).toBe(2);
            expect(Service.inventory).toContain({rewardId: '101', amount: 1});
            expect(Service.inventory).toContain({rewardId: '5', amount: 1});

        });

        it('should get user items correcty', function () {
            Service.rewards = testRewards.slice(0);
            Service.inventory = [{rewardId: '101'}, {rewardId: '1'}];
            expect(Service.getUserSkills().length).toBe(1);
        });

       it('should get user skills correcty', function () {
            Service.rewards = testRewards.slice(0);
            Service.inventory = [{rewardId: '101'}, {rewardId: '1'}];
            expect(Service.getUserSkills().length).toBe(1);
        });

        it('should get recipe with multiple items when enough items are present', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({_id: '1005',
                    name: 'Tree',
                    type: 'Item',
                    ingredients: [{_id: '1', amount: 1}, {_id: '2', amount: 2}, {_id:'3', amount: 1}]}
            );

            Service.inventory = [{rewardId: '101'},
                {rewardId: '1', amount: 1},
                {rewardId: '2', amount: 5},
                {rewardId: '3', amount: 1}];
            Service.calculatePossibleRecipies();
            expect(Service.possibeRecipies.length).toBe(1);
        });

        it('should not offer recipies when not enough items are in inventory', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({_id: '1005',
                    name: 'Tree',
                    type: 'Item',
                    ingredients: [{_id: '1', amount: 1}, {_id: '2', amount: 2}, {_id:'3', amount: 1}]}
            );

            Service.inventory = [{rewardId: '101'},
                {rewardId: '1', amount: 1},
                {rewardId: '2', amount: 1},
                {rewardId: '3', amount: 1}];
            Service.calculatePossibleRecipies();
            expect(Service.possibeRecipies.length).toBe(0);
        });

        it('should get simple recipe correct', function () {
            Service.rewards = testRewards.slice(0);
            Service.rewards.push({_id: '1005',
                    name: 'Tree',
                type: 'Item',
                ingredients: [{_id: '1', amount: 1}, {_id: '2', amount: 1}, {_id:'3', amount: 1}]}
            );

            Service.inventory = [{rewardId: '101'},
                {rewardId: '1', amount: 1},
                {rewardId: '2', amount: 1},
                {rewardId: '3', amount: 1}];
            Service.calculatePossibleRecipies();
            expect(Service.possibeRecipies.length).toBe(1);
        });

        it('should have overlapping items enabled correctly', function () {
            Service.rewards = testRewards.slice(0);
            Service.inventory = [{rewardId: '101'}, {rewardId: '102'}];
            expect(Service.getEnabledItems().length).toBe(5);
        });


        it('should have items enabled correctly', function () {
            Service.rewards = testRewards.slice(0);
            Service.inventory = [{rewardId: '101'}];
            expect(Service.getEnabledItems().length).toBe(4);
        });


        it('should have all rewards when initialized', function () {
            Service.rewards = testRewards.slice(0);
            expect(Service.rewards).toBeTruthy();
            expect(Service.rewards.length).toBe(testRewards.length);
        });


        it('should have empty rewards when not initialized', function () {
            expect(Service.rewards).toBeTruthy();

        });

        var testRewards = [
            {_id: '4', name: 'Rock', type: 'Item', defaulthealthpoints: 3},
            {_id: '3', name: 'Soil', type: 'Item'},
            {_id: '2', name: 'Water', type: 'Item'},
            {_id: '1', name: 'Sapling', type: 'Item'},
            {_id: '102', name: 'Making Fire', type: 'Skill', enables: ['2', '3', '4']},
            {_id: '101', name: 'Building a House', type: 'Skill', enables: ['1', '2', '3', '102']}
        ];





    });
})();
