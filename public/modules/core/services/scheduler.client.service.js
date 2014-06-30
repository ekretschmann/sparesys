'use strict';

angular.module('core').service('RoundRobinSchedulerService', [
	function() {

		return {
            init: function(cards) {
                this.cards = cards;
                this.index = 0;
            },

			nextCard: function() {
                this.index = this.index + 1;
                if (this.cards.length <= this.index) {
                    this.index = 0;
                }


                return this.cards[this.index];
			}
		};
	}
]);