'use strict';

angular.module('core').service('PredictiveSchedulerService', [
	function() {

        return {
            init: function(cards) {
                this.cards = cards;
            },

            getPredictedRetention: function(card, time) {

                if (!card.hrt) {
                    return 0.0;
                }
                var lastRep = card.history.lastRep;
                var hrt = card.hrt;
                var result = Math.exp((time - lastRep) / hrt * Math.log(0.5));
                return result;
            },
            nextCard: function(time) {


                var obj = this;
                var bestValue = 1.0;
                var bestCard;

                this.cards.forEach(function(card) {
                    var pr = obj.getPredictedRetention(card, time);
                    if (Math.abs(pr-0.4) < bestValue) {
                        bestCard = card;
                        bestValue = Math.abs(pr-0.4);
                    }
                });
                return bestCard;
            }
        };
	}
]);