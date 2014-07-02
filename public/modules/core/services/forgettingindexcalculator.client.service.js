'use strict';

angular.module('core').service('ForgettingIndexCalculatorService', [
	function() {

		return {
            record: function(card, time, assessment) {
                card.history = {
                    lastRep: time
                };
                card.hrt = 4;
            },
            getForgettingIndex: function(card) {
                return 1;
            }
		};
	}
]);