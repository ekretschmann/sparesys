'use strict';

angular.module('core').factory('Scheduler', [
	function() {
        //this.index = 0;
        //this.cards = [];

		// Public API
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

                console.log(this.cards.length);
                this.cards.forEach(function(card) {
                    console.log(card);
                });

                return this.cards[this.index];
			}
		};
	}
]);