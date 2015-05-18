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


        it('should have three items enables', function () {
            Service.testInit(testData1);
            expect(Service.rewards).toBeTruthy();
            expect(Service.rewards.length).toBe(4);
        });


        it('should have default rewards when not initialized', function () {
            Service.testInit(testData1);
            expect(Service.rewards).toBeTruthy();
            expect(Service.rewards.length).toBe(4);
        });


        it('should have empty rewards when not initialized', function () {
            expect(Service.rewards).toBeTruthy();
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

        var testData1 = [
            {_id: 4, name: 'Soil', type: 'Item'},
            {_id: 3, name: 'Water', type: 'Item'},
            {_id: 2, name: 'Sapling', type: 'Item'},
            {_id: 1, name: 'Making Fire', type: 'Skill', enables: ['2', '3', '4']}];
    });
})();
