'use strict';


// Courses controller
angular.module('core').controller('ForwardAutoController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {

        $scope.answer = {};
        $scope.answer.text = '';
        $scope.answer.assessment = undefined;
        $scope.state = 'question';


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
        });


        $scope.showAnswer = function () {

            //$state.go($state.current);

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




        $document.bind('keypress', function (event) {

            if($scope.mode !== 'forward' || $scope.assess !== 'auto') {
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

        $scope.nextCard = function () {

            $scope.$parent.nextCard();


            $scope.answer.text = '';

            $scope.state = 'question';
            $timeout(function () {
                angular.element('.focus').trigger('focus');

            }, 100);
        };

    }]);