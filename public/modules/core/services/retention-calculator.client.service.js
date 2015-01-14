'use strict';

angular.module('core').service('RetentionCalculatorService', [
    function () {

        return {

            getPredictedRetention: function(lastRep, hrt, time) {

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
                    // 5 days
                    //return this.randomize(1000 * 60 * 60 * 24 * 5);


                    // 10 s for debugging
                    return this.randomize(1000 * 10);
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

                for (var i = card.history.length-1; i >=0; i--) {
                    var entry = card.history[i];

                    var timeDiff = endTime - entry.when;
                    var pr = this.getPredictedRetention(entry.when, entry.hrt, endTime);

                    var weight = this.calculateWeight(pr);
                    if (entry.assessment === 3) {
                        totalWeight += weight / (counter);
                    }

                    endTime = entry.when;

                    counter++;
                }

                if (assessment === 3) {
                    var maximalMultiplicator = 10;
                    var newHrt = card.hrt*(1+maximalMultiplicator*totalWeight);
                    return newHrt;
                }


                return this.initialAssessment(assessment);

            }
        };
    }
]);