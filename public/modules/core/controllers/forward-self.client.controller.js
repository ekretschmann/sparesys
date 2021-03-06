'use strict';


// Courses controller
angular.module('core').controller('ForwardSelfController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {



        $scope.init = function() {
            $scope.state = 'question';

        };


        $scope.showAnswer = function () {
           // console.log('changing state');
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



        //$scope.bindKeys = function() {
            $document.bind('keypress', function (event) {


                $state.go($state.current);


                if ($scope.$parent.mode !== 'forward' || $scope.$parent.assess !== 'self') {

                    return;
                }

               // console.log(event);
              //  console.log($scope.state);



                if ($state.$current.url.source !== '/practice/:courseId') {
                    return;
                }

                if ($scope.state === 'question' && (event.keyCode === 13 || event.keyCode === 32)) {
                   // console.log('shoul be here');
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
