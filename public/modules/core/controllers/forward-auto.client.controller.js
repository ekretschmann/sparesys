'use strict';


// Courses controller
angular.module('core').controller('ForwardAutoController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {


        $scope.answer = {};
        $scope.answer.text = '';
        $scope.answer.assessment = undefined;
        $scope.keysbound = false;


        $scope.init = function() {
            $scope.state = 'question';

        };

        $timeout(function () {
            angular.element('.focus').trigger('focus');
        }, 100);

        $scope.$watch('card', function() {
            if ($scope.card.readFrontForward) {
                $scope.$parent.playSound($scope.card.languageFront, $scope.card.question);
            }
        });

        $scope.$watch('state', function() {



            if ($scope.state === 'answer' && $scope.card.readBackForward) {
                $scope.$parent.playSound($scope.card.languageBack, $scope.card.answer);
            }

            if ($scope.state === 'question') {

                $timeout(function () {
                    angular.element('#focus-question').trigger('focus');
                    //  console.log(angular.element('#focus-question'));
                }, 100);
            }
        });


        $scope.showAnswer = function () {


            var ratedCorrect = false;

            $scope.answer.assessment = 'wrong';
            if ($scope.card.answer.toLowerCase() === $scope.answer.text.toLowerCase()) {
                $scope.processCard(3);
                $scope.answer.assessment = 'correct';
                ratedCorrect = true;
            }


            $scope.card.acceptedAnswersForward.forEach(function (alt) {
                if (alt.toLowerCase() === $scope.answer.text.toLowerCase()) {
                    $scope.processCard(3);
                    $scope.answer.assessment = 'correct';
                    ratedCorrect = true;
                }
            });

            if (!ratedCorrect) {
                $scope.processCard(0);
            }

            $scope.state = 'answer';

        };


        $scope.processCard = function (rating) {

            $scope.recordRate(Date.now(), rating);

        };



        //$scope.bindKeys = function() {
            $document.bind('keypress', function (event) {

                $state.go($state.current);


                if ($scope.mode !== 'forward' || $scope.assess !== 'auto') {
                    return;
                }



                if ($state.$current.url.source !== '/practice/:courseId') {
                    return;
                }

                if ($scope.state === 'answer' && event.keyCode === 13) {

                    $scope.nextCard();
                    $scope.state = 'question';
                    return;
                }

                if ($scope.state === 'question' && event.keyCode === 13) {
                    $scope.showAnswer();
                    $scope.state = 'answer';

                }
            });

        //};

        $scope.nextCard = function () {

            $scope.$parent.nextCard();


            $scope.answer.text = '';

            $scope.state = 'question';


            $state.go($state.$current);

        };

    }]);