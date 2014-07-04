'use strict';

angular.module('core').service('ForgettingIndexCalculatorService', [
	function() {

		return {
            record: function(card, time, assessment) {

//                console.log(Date.now());

                // setting init values for first iteration
                if (! card.history) {
                    card.history = [];
                }

                if (card.history.length === 0) {
                    if (assessment === 0) {
                        card.hrt = 1*60000;
                    } else if (assessment === 1) {
                        card.hrt = 5*60000;
                    } else if (assessment === 2) {
                        card.hrt = 60*24*60000;
                    } else if (assessment === 3) {
                        card.hrt = 60*24*5*60000;
                    }
                } else {
                    if (assessment === 0) {
                        card.hrt = 1*60000;
                    } else if (assessment === 1) {
                        card.hrt = 5*60000;
                    } else if (assessment === 3) {
                        card.hrt *= 10*60000;
                    }
                }
                card.history.push([time, assessment]);

                card.lastRep = time;
//                console.log(card.history);
//                card.history.lastRep = time;


            },
            getForgettingIndex: function(card) {
                return 1;
            }
		};
	}
]);