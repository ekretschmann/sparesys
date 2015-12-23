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
                    var modes = this.getLowestAssessment(lastAssessForward, lastAssessReverse, lastAssessImages, card.modes);
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

        this.getLowestAssessment = function(lastAssessForward, lastAssessReverse, lastAssessImages, modes) {
            //console.log(lastAssessForward+' '+lastAssessReverse+' '+lastAssessImages);
            if (lastAssessForward < lastAssessImages && lastAssessForward < lastAssessReverse) {

                if (modes.indexOf('forward') > -1) {
                    return ['forward'];
                } else {
                    if (lastAssessReverse < lastAssessImages) {
                        return ['reverse'];
                    } else {
                        if (lastAssessReverse === lastAssessImages) {
                            return ['reverse', 'images'];
                        } else {
                            return ['images'];
                        }
                    }
                }
            }
            if (lastAssessReverse < lastAssessImages && lastAssessReverse < lastAssessForward) {
                if (modes.indexOf('reverse') > -1) {
                    return ['reverse'];
                } else {
                    if (lastAssessForward < lastAssessImages) {
                        return ['forward'];
                    } else {
                        if (lastAssessForward === lastAssessImages) {
                            return ['forward', 'images'];
                        } else {
                            return ['images'];
                        }
                    }
                }
            }
            if (lastAssessImages < lastAssessForward && lastAssessImages < lastAssessReverse) {
                if (modes.indexOf('images') > -1) {
                    return ['images'];
                } else {
                    if (lastAssessForward < lastAssessReverse) {
                        return ['forward'];
                    } else {
                        if (lastAssessForward === lastAssessReverse) {
                            return ['forward', 'reverse'];
                        } else {
                            return ['reverse'];
                        }
                    }
                }

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
            // this shouldn't happen
            return ['forward'];

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


            if(assess ==='Self Checks') {
                assess = 'self';
            }

            if(assess ==='computer' || assess ==='Computer Checks') {
                assess = 'auto';
            }
            return assess;
        };


    }
]);
