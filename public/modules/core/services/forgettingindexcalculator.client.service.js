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
                        card.hrt = 1*10000;
                    } else if (assessment === 1) {
                        card.hrt = 60000;
                    } else if (assessment === 2) {
                        card.hrt = 60*24*60000;
                    } else if (assessment === 3) {
                        card.hrt = 60*24*5*60000;
                    }
                } else {
                    if (assessment === 0) {
                        card.hrt = 1*10000;
                    } else if (assessment === 1) {
                        card.hrt = 60000;
                    } else if (assessment === 3) {
                        card.hrt *= 10*60000;
                    }
                }
                console.log('pushing');
                card.history.push({when: time, assessment: assessment});
                console.log(card.history);

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