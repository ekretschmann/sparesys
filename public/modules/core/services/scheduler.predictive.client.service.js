'use strict';

angular.module('core').service('PredictiveSchedulerService', [
	function() {

        return {
            init: function(cards) {
                this.cards = cards;
            },

            getPredictedCourseRetention: function(time) {
                var sum = 0.0;
                var cardNum = 0;
                this.cards.forEach(function(card) {
                    if (card.lastRep) {
                        sum += this.getPredictedRetention(card, time);
                        cardNum ++;
                    }
                }, this);
                if (cardNum === 0) {
                    return 0.0;
                }
                return sum/cardNum;
            },
            getPredictedRetention: function(card, time) {

                if (!card.hrt) {
                    return 0.0;
                }
                if (!card.lastRep) {
                    card.lastRep = 0;
                }
                var lastRep = card.lastRep;
                var hrt = card.hrt;

//                console.log(time);
//                console.log(lastRep);
//                console.log("  "+(time-lastRep));

                var result = Math.exp((time - lastRep) / hrt * Math.log(0.5));
                return result;
            },
            nextCard: function(time) {

                if (!time) {
                    time = Date.now();
                }

                var bestValue = 1.0;
                var bestCard;
                this.cards.forEach(function(card) {

                    var pr = this.getPredictedRetention(card, time);
//                    console.log(card.question+" - "+pr);
                    if (Math.abs(pr-0.4) < bestValue) {
                        bestCard = card;
                        bestValue = Math.abs(pr-0.4);
                    }
                }, this);
//                console.log('best card: '+bestCard.question);
                return bestCard;
            }
        };
	}
]);