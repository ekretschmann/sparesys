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


        it('should get user items correcty', function () {
            Service.rewards = testRewards;
            Service.inventory = [{rewardId: '101'}, {rewardId: '1'}];
            expect(Service.getUserSkills().length).toBe(1);
        });

        it('should get user skills correcty', function () {
            Service.rewards = testRewards;
            Service.inventory = [{rewardId: '101'}, {rewardId: '1'}];
            expect(Service.getUserSkills().length).toBe(1);
        });

        it('should get recipe with multiple items when enough items are present', function () {
            Service.rewards = testRewards;
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
            Service.rewards = testRewards;
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
            Service.rewards = testRewards;
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
            Service.rewards = testRewards;
            Service.inventory = [{rewardId: '101'}, {rewardId: '102'}];
            expect(Service.getEnabledItems().length).toBe(4);
        });


        it('should have items enabled correctly', function () {
            Service.rewards = testRewards;
            Service.inventory = [{rewardId: '101'}];
            expect(Service.getEnabledItems().length).toBe(3);
        });


        it('should have all rewards when initialized', function () {
            Service.rewards = testRewards;
            expect(Service.rewards).toBeTruthy();
            expect(Service.rewards.length).toBe(testRewards.length);
        });


        it('should have empty rewards when not initialized', function () {
            expect(Service.rewards).toBeTruthy();

        });

        var testRewards = [
            {_id: '4', name: 'Rock', type: 'Item'},
            {_id: '3', name: 'Soil', type: 'Item', amount: 1},
            {_id: '2', name: 'Water', type: 'Item', amount: 1},
            {_id: '1', name: 'Sapling', type: 'Item', amount: 1},
            {_id: '102', name: 'Making Fire', type: 'Skill', enables: ['2', '3', '4']},
            {_id: '101', name: 'Building a House', type: 'Skill', enables: ['1', '2', '3']}
        ];




        //var card1 = new Cards({name: 'c1'});
        //var card2 = new Cards({name: 'c2'});
        //var card3 = new Cards({name: 'c3'});
        //
        //SchedulerService.init([card1, card2, card3]);
        //var result = SchedulerService.nextCard();
        //expect(result.name).toBe('c1');
        //result = SchedulerService.nextCard();
        //expect(result.name).toBe('c2');
        //result = SchedulerService.nextCard();
        //expect(result.name).toBe('c3');
        //result = SchedulerService.nextCard();
        //expect(result.name).toBe('c1');
    });
})();
