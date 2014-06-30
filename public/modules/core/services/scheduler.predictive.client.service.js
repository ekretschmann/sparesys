'use strict';

angular.module('core').service('PredictiveSchedulerService', [
	function() {

		return {
            init: function(cards) {
                this.cards = cards;
                this.index = -1;
            },

			nextCard: function() {
                this.index = this.index + 1;
                if (this.cards.length <= this.index) {
                    this.index = 0;
                }


                return this.cards[this.index];
			},
            getPredictedRetention: function(card) {
                return 0.0;
            }
		};
	}
]);