'use strict';

angular.module('core').service('ChallengeCalculatorService', [
    function () {

        console.log('xxxxx');
        this.minimalDoneScore = 0;
        this.total = 0;
        this.candidates = 0;
        this.over80 = 0;
        this.old = 0;

        this.oldCard = function () {
            this.old++;
        };

        this.retention = function (retention) {
            if (retention > 0.8) {
                this.over80++;
            }
        };

        this.candidateCard = function () {
            this.candidates++;
        };

        this.reset = function () {
            this.total = 0;
            this.candidates = 0;
            this.over80 = 0;
        };

        this.setCardTotal = function (total) {
            this.total = total;
        };

        this.getDoneScore = function () {

            //var currentDoneScore = -1;
            ////if ($scope.challenge === 'dueDate') {
            ////    if ($scope.requiredRetention > 0) {
            ////
            ////
            ////        var actualScore = Math.round(100 * $scope.dueRetention / $scope.requiredRetention);
            ////        currentDoneScore = Math.min(100, actualScore);
            ////
            ////        if ($scope.doneScore < currentDoneScore) {
            ////            $scope.doneScore = currentDoneScore;
            ////        }
            ////
            ////        if(actualScore > 100) {
            ////            $scope.challenge = 'eighty';
            ////            $scope.doneScore = 0;
            ////            currentDoneScore =0;
            ////        }
            ////
            ////
            ////    } else {
            ////        $scope.challenge === 'eighty';
            ////    }
            ////}
            //
            //// dont make this an else if
            //if ($scope.challenge === 'eighty') {

            if(!this.old) {
                return 0;
            }

            var doneScore = Math.min(100, Math.round(this.over80 / this.old));
            if (this.minimalDoneScore < doneScore) {
                this.minimalDoneScore = doneScore;
            }
            console.log(this.minimalDoneScore);
            return this.minimalDoneScore;

        };

        this.getColor = function () {
            var green = (Math.round(Math.min(90, this.minimalDoneScore) * 2));
            var red = (Math.round(Math.max(10, (100 - this.minimalDoneScore)) * 2));
            var blue = Math.round(Math.min(green, red) / 3);

            red = red.toString(16);
            green = green.toString(16);
            blue = blue.toString(16);
            if (red.length === 1) {
                red = '0' + red;
            }
            if (green.length === 1) {
                green = '0' + green;
            }
            if (blue.length === 1) {
                blue = '0' + blue;
            }

            var col = '#' + red + '' + green + '' + blue;
        };
    }
]);
