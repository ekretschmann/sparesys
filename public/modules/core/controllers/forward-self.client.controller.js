'use strict';


// Courses controller
angular.module('core').controller('ForwardSelfController', ['$scope', '$state', '$document',
    function ($scope, $state, $document) {



        $scope.init = function() {
            $scope.state = 'question';

        };


        $scope.showAnswer = function () {
            $scope.state = 'answer';
            $state.go($state.current);
        };


        $scope.processCard = function (rating) {
            $scope.$parent.recordRate(Date.now(), rating);
            $scope.state = 'question';
            $scope.$parent.nextCard();
        };



        //$scope.bindKeys = function() {
            $document.bind('keypress', function (event) {


                $state.go($state.current);


                if ($scope.$parent.mode !== 'forward' || $scope.$parent.assess !== 'self') {

                    return;
                }

                console.log(event);



                if ($state.$current.url.source !== '/practice/:courseId') {
                    return;
                }

                if ($scope.state === 'question' && (event.keyCode === 13 || event.keyCode === 32)) {
                    console.log('shoul be here');
                    $scope.showAnswer();
                    return;
                }


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
        //};

    }]);
