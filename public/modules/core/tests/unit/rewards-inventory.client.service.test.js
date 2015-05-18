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

        it('should get recipies correctly', function () {
            Service.rewards = testRewards;
            Service.inventory = [{reward: '101'}, {reward: '1'}, {reward: '2'}, {reward: '3'}];
            expect(Service.getEnabledRecipies().length).toBe(1);
        });

        it('should have overlapping items enabled correctly', function () {
            Service.rewards = testRewards;
            Service.inventory = [{reward: '101'}, {reward: '102'}];
            expect(Service.getEnabledItems().length).toBe(4);
        });


        it('should have items enabled correctly', function () {
            Service.rewards = testRewards;
            Service.inventory = [{reward: '101'}];
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
            {_id: '5', name: 'Tree', type: 'Item', ingredients: ['1', '2', '3']},
            {_id: '4', name: 'Rock', type: 'Item'},
            {_id: '3', name: 'Soil', type: 'Item'},
            {_id: '2', name: 'Water', type: 'Item'},
            {_id: '1', name: 'Sapling', type: 'Item'},
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
