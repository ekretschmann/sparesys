'use strict';

(function () {
    describe('PredictiveSchedulerService', function () {
        //Initialize global variables
        var SchedulerService, Cards, SchedulerService;

        // Load the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        beforeEach(inject(function (_PredictiveSchedulerService_, _Cards_) {
            SchedulerService = _PredictiveSchedulerService_;
            Cards = _Cards_;
        }));

//        it('should multiply forgetting index by 10 when assessment is 3', function () {
//            var card1 = new Cards({question: 'c1', history:[[10,3],[20,2],[30,3]], hrt: 10});
//            SchedulerService.record(card1, 40, 3);
//
//            expect(card1.hrt).isTruthy(10*60000);
//
//            var card2 = new Cards({question: 'c2', history:[[10,3],[20,2],[30,3]], hrt: 100});
//            SchedulerService.record(card2, 40, 3);
//
//            expect(card2.hrt).toBe(1000*60000);
//        });

        it('should keep forgetting index when assessment is 2', function () {
            var card1 = new Cards({question: 'c1', history:[[10,3],[20,2],[30,3]], hrt: 10*60000});
            SchedulerService.record(card1, 40, 2);

            expect(card1.hrt).toBe(10*60000);

            var card2 = new Cards({question: 'c2', history:[[10,3],[20,2],[30,3]], hrt: 100*60000});
            SchedulerService.record(card2, 40, 2);

            expect(card2.hrt).toBe(100*60000);
        });

        it('should set forgetting index to one minute when assessment is 1', function () {
            var card1 = new Cards({question: 'c1', history:[[10,3],[20,2],[30,3]], hrt: 0});
            SchedulerService.record(card1, 40, 1);

            expect(card1.hrt).toBe(1*60000);
        });

        it('should set forgetting index to ten seconds when assessment is 0', function () {
            var card1 = new Cards({question: 'c1', history:[[10,3],[20,2],[30,3]], hrt: 0});
            SchedulerService.record(card1, 40, 0);

            expect(card1.hrt).toBe(10*1000);
        });

        it('should set forgetting index to five days on empty history when assessment is 3', function () {
            var card1 = new Cards({question: 'c1', history:[], hrt: 0, created: 0});
            SchedulerService.record(card1, 10, 3);

            expect(card1.hrt).toBe(60*24*5*60000);
        });

        it('should set forgetting index to one day on empty history when assessment is 2', function () {
            var card1 = new Cards({question: 'c1', history:[], hrt: 0});
            SchedulerService.record(card1, 0, 2);

            expect(card1.hrt).toBe(60*24*60000);
        });

        it('should set forgetting index to one minute on empty history when assessment is 1', function () {
            var card1 = new Cards({question: 'c1', history:[], hrt: 0});
            SchedulerService.record(card1, 0, 1);

            expect(card1.hrt).toBe(1*60000);
        });

        it('should set forgetting index to ten seconds on empty history when assessment is 0', function () {
            var card1 = new Cards({question: 'c1', history:[], hrt: 0});
            SchedulerService.record(card1, 0, 0);

            expect(card1.hrt).toBe(10*1000);
        });

        it('should return the card whose predicted retention is closest to 0.4 ', function () {
            var card1 = new Cards({question: 'c1'});
            var card2 = new Cards({question: 'c2'});

            SchedulerService.record(card1, 0, 3);
            var hrt1 = card1.hrt;

            SchedulerService.record(card2, hrt1, 3);
            var hrt2 = card2.hrt;

            var now = card2.lastRep;

            SchedulerService.init([card2, card1]);

            var pr1 = SchedulerService.getPredictedRetention(card1, now);
            expect(pr1).toBe(0.5);

            var pr2 = SchedulerService.getPredictedRetention(card2, now);
            expect(pr2).toBe(1.0);

            var nextCard = SchedulerService.nextCard(now);
            expect(nextCard.question).toBe('c1');
        });

        it('should predict retention of 1.0 if card is repeated immediately', function () {
            var card = new Cards({question: 'c1'});

            SchedulerService.record(card, 0, 3);
            var half_retention_point = card.hrt;
            var last_repetition = card.lastRep;

            var predicted_retention = SchedulerService.getPredictedRetention(card, last_repetition);
            expect(predicted_retention).toBe(1.0);
        });

        it('should predict retention of 0.125 at four times time of predicted halving of retention', function () {
            var card = new Cards({question: 'c1'});

            SchedulerService.record(card, 0, 3);
            var half_retention_point = card.hrt;

            var predicted_retention = SchedulerService.getPredictedRetention(card, half_retention_point * 3);
            var rounded = Math.round(predicted_retention * 1000) / 1000.0;
            expect(rounded).toBe(0.125);
        });

        it('should predict retention of 0.25 at two times time of predicted halving of retention', function () {
            var card = new Cards({question: 'c1'});

            SchedulerService.record(card, 0, 3);
            var half_retention_point = card.hrt;

            var predicted_retention = SchedulerService.getPredictedRetention(card, half_retention_point * 2);
            expect(predicted_retention).toBe(0.25);
        });

        it('should predict retention of 0.5 at time of predicted halving of retention', function () {
            var card = new Cards({question: 'c1'});

            SchedulerService.record(card, 0, 3);
            var half_retention_point = card.hrt;

            var predicted_retention = SchedulerService.getPredictedRetention(card, half_retention_point);
            expect(predicted_retention).toBe(0.5);
        });

        it('should predict retention of 0.0 for a card with no history', function () {
            var card = new Cards({question: 'c1'});

            var predicted_retention = SchedulerService.getPredictedRetention(card, 0);
            expect(predicted_retention).toBe(0.0);

        });

        it('should return the same card over and over again in a pack of one', function () {
            var card = new Cards({question: 'c1'});

            var cards = [card];

            SchedulerService.init(cards);
            var result = SchedulerService.nextCard(0);
            expect(result.question).toBe('c1');
            result = SchedulerService.nextCard(0);
            expect(result.question).toBe('c1');
        });

        it('should return undefined when there are no cards in the pack', function () {

            SchedulerService.init([]);
            var result = SchedulerService.nextCard(0);
            expect(result).toBe(undefined);
        });
    });
})();