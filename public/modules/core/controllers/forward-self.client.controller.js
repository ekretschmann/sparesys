'use strict';


// Courses controller
angular.module('core').controller('ForwardSelfController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {

        $scope.init = function() {
            $scope.state = 'question';

        };



        $scope.$watch('card', function() {
            if ($scope.card.readFrontForward && $scope.mode === 'forward' && $scope.assess==='self') {
                $scope.$parent.playSound($scope.card.languageFront, $scope.card.question);

                if($scope.card.questionExtension) {
                    $scope.$parent.playSound($scope.card.languageFront, $scope.card.questionExtension);
                }
            }
        });

        $scope.$watch('state', function() {
            if ($scope.state === 'answer' && $scope.card.readBackForward) {
                $scope.$parent.playSound($scope.card.languageBack, $scope.card.answer);
            }

            //if ($scope.state === 'question') {
            //
            //    $timeout(function () {
            //        angular.element('#focus-question').trigger('focus');
            //        //  console.log(angular.element('#focus-question'));
            //    }, 100);
            //}

        });

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



                if ($state.$current.url.source !== '/practice/:courseId') {
                    return;
                }


                if ($scope.state === 'question' && event.keyCode === 13) {
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