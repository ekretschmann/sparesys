'use strict';

angular.module('core').service('RetentionCalculatorService', [
    function () {

        return {

            getPredictedCardRetention: function(card) {
                if (!card.history || card.history.length === 0) {
                    return 0.0;
                }
                var hist = card.history[card.history.length-1];
                return this.getPredictedRetention(hist.when, hist.hrt, Date.now());

            },

            getPredictedRetention: function(lastRep, hrt, time) {

                //console.log(lastRep);
                //console.log(hrt);
                //console.log(time);
                return Math.exp((time - lastRep) / hrt * Math.log(0.5));
            },

            randomize: function (val) {
                return val * (Math.random() / 10.0 + 1.0);
            },
            initialAssessment: function(assessment) {
                if (assessment === 0) {
                    // 30 s
                    return this.randomize(30 * 1000);
                } else if (assessment === 1) {
                    // 5 min
                    return this.randomize(1000 * 60 * 5);
                } else if (assessment === 2) {
                    // 1 day
                    return this.randomize(1000 * 60 * 60 * 24);
                } else if (assessment === 3) {
                    // 3 days


                    return this.randomize(1000 * 60 * 60 * 24 * 3);


                    // 10 s for debugging
                    //return this.randomize(1000 * 10);
                }
            },
            calculateWeight: function(pr) {
                if (pr >=0.4) {
                    return 5/3 - 1/0.6*pr;
                } else {
                    return 2 - (5/3-1/0.6*pr);
                }
            },

            calculateFor: function (card, time, assessment) {
                console.log(card.question);

                var hrt;

                // setting init values for first iteration
                if (!card.history) {
                    card.history = [];
                }

                if (card.history.length === 0 ) {
                    return this.initialAssessment(assessment);
                }


                var endTime = time;
                var counter = 1;
                var totalWeight = 0;

                //console.log(card.question);

                for (var i = card.history.length-1; i >=0; i--) {
                    console.log('  ',i);
                    var entry = card.history[i];


                    var timeDiff = endTime - entry.when;
                    var pr = this.getPredictedRetention(entry.when, entry.hrt, endTime);
                    console.log('  pr:',pr);
                    var weight = this.calculateWeight(pr);
                    console.log('  w: ',weight);
                    totalWeight += (entry.assessment+1)*weight / (counter*counter);
                    console.log('  tw:',totalWeight);
                    endTime = entry.when;

                    if (counter++ > 3) {
                        break;
                    }
                }


                var maximalMultiplicator = 3;

                if (assessment === 3) {


                    // loss than an hour
                    if(card.hrt <= 1000*60*60) {
                        maximalMultiplicator = 50;
                    }


                    // less than a day
                    if(card.hrt > 1000*60*60 && card.hrt <= 1000*60*60*24) {
                        maximalMultiplicator = 25;
                    }

                    // less than a month
                    if(card.hrt > 1000*60*60*24 && card.hrt <= 1000*60*60*24*30) {
                        maximalMultiplicator = 5;
                    }



                    //console.log(totalWeight);
                    return card.hrt*(1+maximalMultiplicator*totalWeight);
                }

                if (assessment === 2) {

                    maximalMultiplicator = 2;

                    return card.hrt*(1+maximalMultiplicator*totalWeight);

                }

                if (assessment === 1) {

                    return card.hrt;

                }


                return this.initialAssessment(assessment);

            }
        };
    }
]);
