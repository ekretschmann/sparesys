'use strict';

/* global d3 */
angular.module('core').service('PracticeOptionsService', [
    function () {


            this.repeatOnly = false;
            this.selfChecksOnly = false;
            this.useForwardMode = true;
            this.useReverseMode = true;
            this.useImageMode = true;
            this.speechRate = 1;
            this.hoverRate = 0;


        this.rateHover = function(value) {
            console.log('hover');
            this.hoverRate = value;
        };

        this.rateClick = function() {
            console.log('click');
            this.speechRate = 2*(this.hoverRate-1);
        };

    }
])
;
