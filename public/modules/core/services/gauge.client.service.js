'use strict';

/* global d3 */
angular.module('core').service('GaugeService', ['DiagramsService', '$timeout',
    function (DiagramsService, $timeout) {


        this.loadLiquidFillGauge = function (score, colorCode) {

            if (score < 0) {
                return;
            }

            $timeout(function () {
                var config1 = DiagramsService.liquidFillGaugeDefaultSettings();
                config1.circleColor = colorCode;
                config1.textColor = colorCode;
                config1.waveTextColor = colorCode;
                config1.waveColor = '#CCCCFF';
                config1.circleThickness = 0.2;
                config1.textVertPosition = 0.2;
                config1.waveAnimateTime = 1000;
                DiagramsService.loadLiquidFillGauge('fillgauge', score, config1);
            }, 200);

        };

    }
])
;
