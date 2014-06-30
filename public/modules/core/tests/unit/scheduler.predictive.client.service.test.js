'use strict';

(function() {
	describe('PredictiveSchedulerService', function() {
		//Initialize global variables
		var SchedulerService, Cards;

		// Load the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function (_PredictiveSchedulerService_, _Cards_) {
            SchedulerService = _PredictiveSchedulerService_;
            Cards = _Cards_;
        }));


        it('should predict retention of 0.5 at time of predicted halving of retention', function() {
            var card = new Cards({question: 'c1', history: [
                [1, 3]
            ]});

            var predicted_retention = SchedulerService.getPredictedRetention(card);
            expect(predicted_retention).toBe(0.0);

        });

        it('should predict retention of 0.0 for a card with no history', function() {
            var card = new Cards({question: 'c1', history: []});

            var predicted_retention = SchedulerService.getPredictedRetention(card);
            expect(predicted_retention).toBe(0.0);

        });

        it('should return the same card over and over again in a pack of one', function() {
            var card = new Cards({question: 'c1'});

            SchedulerService.init([card]);
            var result = SchedulerService.nextCard();
            expect(result.question).toBe('c1');
            result = SchedulerService.nextCard();
            expect(result.question).toBe('c1');
        });

        it('should return undefined when there are no cards in the pack', function() {

            SchedulerService.init([]);
            var result = SchedulerService.nextCard();
            expect(result).toBe(undefined);
        });
	});
})();