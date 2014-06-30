'use strict';

(function() {
	describe('RoundRobinSchedulerService', function() {
		//Initialize global variables
		var SchedulerService, Cards;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function (_RoundRobinSchedulerService_, _Cards_) {
            SchedulerService = _RoundRobinSchedulerService_;
            Cards = _Cards_;
        }));


        it('should alternate cards correctly in a pack of three', function() {
            var card1 = new Cards({name: 'c1'});
            var card2 = new Cards({name: 'c2'});
            var card3 = new Cards({name: 'c3'});

            SchedulerService.init([card1, card2, card3]);
            var result = SchedulerService.nextCard();
            expect(result.name).toBe('c1');
            result = SchedulerService.nextCard();
            expect(result.name).toBe('c2');
            result = SchedulerService.nextCard();
            expect(result.name).toBe('c3');
            result = SchedulerService.nextCard();
            expect(result.name).toBe('c1');
        });

		it('should return the same card over and over again in a pack of one', function() {
            var card = new Cards({
                name: 'c1'
            });

            SchedulerService.init([card]);
            var result = SchedulerService.nextCard();
            expect(result.name).toBe('c1');
            result = SchedulerService.nextCard();
            expect(result.name).toBe('c1');
		});

        it('should return undefined when there are no cards in the pack', function() {

            SchedulerService.init([]);
            var result = SchedulerService.nextCard();
            expect(result).toBe(undefined);
        });
	});
})();