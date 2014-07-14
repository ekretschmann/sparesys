'use strict';

angular.module('core').service('PredictiveSchedulerService', [
	function() {

        return {
            init: function(cards) {
                this.cards = cards;
            },

            getPredictedCourseRetention: function(time) {
                if (!this.cards) {
                    return 0.0;
                }
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

                if (!card) {
                    return 0.0;
                }
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

                return Math.exp((time - lastRep) / hrt * Math.log(0.5));
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
            },
            record: function(card, time, assessment) {


                // setting init values for first iteration
                if (! card.history) {
                    card.history = [];
                }

                if (card.history.length === 0) {
                    if (assessment === 0) {
                        card.hrt = 10000;
                    } else if (assessment === 1) {
                        card.hrt = 60000;
                    } else if (assessment === 2) {
                        card.hrt = 60*24*60000;
                    } else if (assessment === 3) {
                        card.hrt = 60*24*5*60000;
                    }
                } else {
                    if (assessment === 0) {
                        card.hrt = 10000;
                    } else if (assessment === 1) {
                        card.hrt = 60000;
                    } else if (assessment === 3) {
                        if (card.hrt === 0) {card.hrt = 10000;}

                        var pr = this.getPredictedRetention(card, time);
                        var weight = 0.0;
                        if (pr >=0.4) {
                            weight = 5/3 - 1/0.6*pr;
                        } else {
                            weight = 2 - (5/3-1/0.6*pr);
                        }
                        card.hrt *= 10*weight;
                    }
                }
                card.history.push({when: time, assessment: assessment});

                card.lastRep = time;


            }
        };
	}
]);