'use strict';

angular.module('core').service('RetentionCalculatorService', [
    function () {

        return {


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
                    return this.randomize(1000 * 60 * 60 * 24 * 5);
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


                console.log(time);
                card.history.forEach(function (entry) {
                    console.log(entry);
                });


                return this.initialAssessment(assessment);

            }
        };
    }
]);