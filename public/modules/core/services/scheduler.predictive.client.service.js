'use strict';

angular.module('core').service('PredictiveSchedulerService', [
	function() {

        return {
            init: function(cards) {
                this.cards = cards;
                this.analysis = {};
            },
            getCourseStart: function() {
                if(!this.cards) {
                    return Date.now();
                }
                var min = Date.now();
                this.cards.forEach(function(card) {
                    if (card.history && card.history.length >0) {
                        if (card.history[0].when < min) {
                            min = card.history[0].when;
                        }
                    }
                }, this);
                return new Date(min);
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



                return Math.exp((time - lastRep) / hrt * Math.log(0.5));
            },
            nextCard: function(time) {

                if (!time) {
                    time = Date.now();
                }

                var bestValue = 1.0;
                var bestCard;
                this.cards.forEach(function(card) {

                    if (!card.after || time >=new Date(card.after).getTime()) {


                        var pr = this.getPredictedRetention(card, time);


                        if (card.hrt > 1000 * 60 * 60 * 24) {
                            this.analysis[card.question] = {pr: Math.round(pr * 100000) / 1000, hrt: Math.round(card.hrt / (1000 * 60 * 60 * 24)) + ' days'};
                        } else if (card.hrt > 1000 * 60 * 60) {
                            this.analysis[card.question] = {pr: Math.round(pr * 100000) / 1000, hrt: Math.round(card.hrt / (1000 * 60 * 60)) + ' hours'};
                        } else if (card.hrt > 1000 * 60) {
                            this.analysis[card.question] = {pr: Math.round(pr * 100000) / 1000, hrt: Math.round(card.hrt / (1000 * 60)) + ' mins'};
                        } else {
                            this.analysis[card.question] = {pr: Math.round(pr * 100000) / 1000, hrt: Math.round(card.hrt / (1000)) + ' secs'};
                        }
                        if (Math.abs(pr - 0.4) < bestValue) {
                            bestCard = card;
                            bestValue = Math.abs(pr - 0.4);
                        }
                    }
                }, this);
                return bestCard;
            },
            getAnalysis: function() {
                return this.analysis;
            },
            getMaxHrt: function(card, time) {
                var pr = this.getPredictedRetention(card, time);
                var weight = 0.0;
                if (pr >=0.4) {
                    weight = 5/3 - 1/0.6*pr;
                } else {
                    weight = 2 - (5/3-1/0.6*pr);
                }
                return card.hrt * (1 + weight*10);
            },
            record: function(card, time, assessment) {


                // setting init values for first iteration
                if (! card.history) {
                    card.history = [];
                }

                if (card.history.length === 0) {
                    if (assessment === 0) {
                        // 10 s
                        card.hrt = 10000;
                    } else if (assessment === 1) {
                        // 10 min
                        card.hrt = 1000*60*10 * (Math.random()/10.0+1.0);
                    } else if (assessment === 2) {
                        // 1 day
                        card.hrt = 1000*60*60*24 * (Math.random()/10.0+1.0);
                    } else if (assessment === 3) {
                        // 5 days
                        card.hrt = 1000*60*60*24*5 * (Math.random()/10.0+1.0);
                    }
                } else {
                    if (assessment === 0) {
                        // 10 s
                        card.hrt = 10000 * (Math.random()/10.0+1.0);
                    } else if (assessment === 1) {
                        // 10 min
                        card.hrt = 1000*60*10 * (Math.random()/10.0+1.0);
                    } else {
                        if (card.hrt < 10000) {card.hrt = 10000;}

                        var pr = this.getPredictedRetention(card, time);
                        var weight = 0.0;
                        if (pr >=0.4) {
                            weight = 5/3 - 1/0.6*pr;
                        } else {
                            weight = 2 - (5/3-1/0.6*pr);
                        }
                        if (assessment === 2) {
                            card.hrt *= 1 + weight*2;
                        } else if (assessment === 3) {
                            card.hrt *= 1 + weight*10;
                        }


                    }
                }
                card.history.push({when: time, assessment: assessment});

                card.lastRep = time;


            }
        };
	}
]);