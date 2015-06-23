'use strict';

angular.module('core').service('ModeSelectorService', [
    function () {


        this.getRepetitionParametersOld = function(card) {
            return {mode: card.modes[Math.floor(Math.random() * card.modes.length)],
                assess: 'self'};
        };

        this.getRepetitionParameters = function(card) {

           // console.log('aaaaa');
            //console.log(card.modes);
            //console.log(card.check);
            //console.log(card.history);



            var assess = this.getAssess(card);


            var mode = 'forward';
            if (card.modes.length > 1) {
                //console.log(card.history);
                if (!card.history || card.history.length === 0) {
                    if (card.modes.indexOf('forward') === -1) {
                        if (card.modes.indexOf('images') === -1) {
                            mode = 'reverse';
                        } else {
                            mode = 'images';
                        }
                    }
                } else {
                    var lastAssessForward = 0;
                    var lastAssessReverse = 0;
                    var lastAssessImages = 0;
                    var lastHrtForward = 0;
                    var lastHrtReverse = 0;
                    var lastHrt = {};

                    for (var i=0; i < card.history.length; i++) {
                        if(card.history[i].mode === 'forward') {
                            lastAssessForward = card.history[i].assessment;
                            lastHrt.forward = card.history[i].hrt;
                        } else if (card.history[i].mode === 'reverse') {
                            lastAssessReverse = card.history[i].assessment;
                            lastHrt.reverse = card.history[i].hrt;
                        } else if (card.history[i].mode === 'images') {
                            lastAssessImages = card.history[i].assessment;
                            lastHrt.images = card.history[i].hrt;
                        }
                    }
                    var modes = this.getLowestAssessment(lastAssessForward, lastAssessReverse, lastAssessImages);
                    if (modes.length === 1) {
                        mode = modes[0];
                    } else {
                        var min = lastHrt[modes [0]];
                        var minMode = modes[0];
                        for(var j=1; j < modes.length; j++) {
                            var m = modes[j];
                            if (lastHrt[m] < min) {
                                minMode = m;
                                min = lastHrt[m];
                            }
                        }
                        mode = minMode;
                    }
                }

            } else {
                mode = card.modes[0];
            }

            return {mode: mode, assess: assess};
        };

        this.getLowestAssessment = function(lastAssessForward, lastAssessReverse, lastAssessImages) {
            if (lastAssessForward < lastAssessImages && lastAssessForward < lastAssessReverse) {
                return ['forward'];
            }
            if (lastAssessReverse < lastAssessImages && lastAssessReverse < lastAssessForward) {
                return ['reverse'];
            }
            if (lastAssessImages < lastAssessForward && lastAssessImages < lastAssessReverse) {
                return ['images'];
            }
            if (lastAssessForward === lastAssessReverse && lastAssessReverse === lastAssessImages) {
                return ['forward', 'reverse', 'images'];
            }
            if (lastAssessReverse === lastAssessImages) {
                return ['reverse', 'images'];
            }
            if (lastAssessForward === lastAssessImages) {
                return ['forward', 'images'];
            }
            if (lastAssessForward === lastAssessReverse) {
                return ['forward', 'reverse'];
            }

        };


        this.getAssess = function(card) {
            var assess = card.check;
            if (card.check === 'mixed') {
                if (!card.history || card.history.length === 0) {
                    assess = 'self';
                } else {
                    assess = 'self';
                    for (var i=0; i < card.history.length; i++) {
                        if (card.history[i].hrt > 1000*3600*24*5) {
                            assess = 'auto';
                        }
                    }
                }
            }

            if(assess ==='computer') {
                assess = 'auto';
            }
            return assess;
        };


    }
]);
