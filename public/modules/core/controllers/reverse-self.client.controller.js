'use strict';


// Courses controller
angular.module('core').controller('ReverseSelfController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {

        $scope.state = 'question';

        $scope.showAnswer = function () {
            $scope.state = 'answer';
            $timeout(function () {
                $state.go($state.current);
            }, 100);

        };

        $scope.processCard = function (rating) {

            $scope.$parent.recordRate(Date.now(), rating);
            $scope.state = 'question';
            $scope.$parent.nextCard();
        };

        $document.bind('keypress', function (event) {

            $state.go($state.current);

            if($scope.mode !== 'reverse' || $scope.assess !== 'self') {
                return;
            }


            if ($state.$current.url.source !== '/practice/:courseId') {
                return;
            }


            if ($scope.state === 'question' && event.keyCode === 13) {
                $scope.showAnswer();
                return;
            }

            //if ($scope.state === 'question') {
            //    return;
            //}

            if ($scope.state === 'answer') {
                if (event.charCode === 49) {
                    $scope.processCard(1);
                }
                if (event.charCode === 50) {
                    $scope.processCard(2);
                }
                if (event.charCode === 51) {
                    $scope.processCard(3);
                }
                if (event.charCode === 48) {
                    $scope.processCard(0);
                }
            }

        });



    }]);