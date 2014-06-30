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

		it('should return the same card over and over again in a stack of one', function() {
            var card = new Cards({
                name: 'c1'
            });

            SchedulerService.init([card]);
            var result = SchedulerService.nextCard();
            expect(result.name).toBe('c1');
            result = SchedulerService.nextCard();
            expect(result.name).toBe('c1');
		});
	});
})();