'use strict';

angular.module('core').service('KeyEventService', [
    function () {

        this.boundModes = [];

        this.isInitialized = function (mode) {
            return this.boundModes.indexOf(mode) !== -1;
        };

        this.setInitialized = function (mode) {
            this.boundModes.push(mode);
        };
    }
]);