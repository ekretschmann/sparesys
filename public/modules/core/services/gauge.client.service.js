'use strict';

/* global d3 */
angular.module('core').service('GaugeService', ['DiagramsService', '$timeout',
    function (DiagramsService, $timeout) {


        //$scope.doneColorCode = {'color': '#00FF00'};
        //$scope.doneColorCode = {'color': ChallengeCalculatorService.getColor()};


        //scope.$watch('doneScore', function () {
        //    $timeout(function() {
        //        $scope.loadLiquidFillGauge($scope.doneScore, $scope.doneColorCode);
        //    }, 200);
        //});


        this.loadLiquidFillGauge = function (score, colorCode) {


            if (score < 0) {
                return;
            }

            $timeout(function () {
                var config1 = DiagramsService.liquidFillGaugeDefaultSettings();
                config1.circleColor = colorCode.color;
                config1.textColor = colorCode.color;
                config1.waveTextColor = colorCode.color;
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
