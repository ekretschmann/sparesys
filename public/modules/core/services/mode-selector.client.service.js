'use strict';

angular.module('core').service('ModeSelectorService', [
    function () {


        this.getRepetitionParameters = function(card) {

            //console.log('aaaaa');
            //console.log(card.modes);
            //console.log(card.check);
            //console.log(card.history);

            return {mode: card.modes[Math.floor(Math.random() * card.modes.length)],
                assess: 'self'};
        };


    }
]);
