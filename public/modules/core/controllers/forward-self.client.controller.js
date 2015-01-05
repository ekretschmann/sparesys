'use strict';


// Courses controller
angular.module('core').controller('ForwardSelfController', ['$scope', '$state', '$document',
    function ($scope, $state, $document) {

        $scope.state = 'question';

        $scope.showAnswer = function () {
            $scope.state = 'answer';
            $state.go($state.current);
        };


        $scope.processCard = function (rating) {

            $scope.$parent.recordRate($scope.card, Date.now(), rating);
            $scope.state = 'question';
                $scope.$parent.nextCard();


        };

        $scope.toDate = function(h) {
            return new Date(h);
        };


        $scope.toHours = function(num) {
            return Math.round(100 * num / 3600000) / 100;
        };


        $scope.round = function(num) {
            return Math.round(10000 * num) / 10000;
        };

    }]);