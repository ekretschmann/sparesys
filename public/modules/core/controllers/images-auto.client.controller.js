'use strict';


// Courses controller
angular.module('core').controller('ImagesAutoController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {

        $scope.answer = {};
        $scope.answer.text = '';
        $scope.answer.assessment = undefined;
        $scope.state = 'question';


        $timeout(function () {
            angular.element('.focus').trigger('focus');
        }, 100);

        $scope.$watch('card', function() {
            if ($scope.card.imagesReadFront) {
                $scope.$parent.playSound($scope.card.languageFront, $scope.card.question);
            }
        });

        $scope.$watch('state', function() {
            if ($scope.state === 'answer' && $scope.card.imagesReadBack) {
                $scope.$parent.playSound($scope.card.languageBack, $scope.card.answer);
            }
        });

        $scope.showAnswer = function () {

            $scope.state = 'answer';
            $state.go($state.current);

            var ratedCorrect = false;

            $scope.answer.assessment = 'wrong';
            if ($scope.card.answer.toLowerCase() === $scope.answer.text.toLowerCase()) {
                $scope.processCard(3);
                $scope.answer.assessment = 'correct';
                ratedCorrect = true;
            }


            $scope.card.alternativesFront.forEach(function (alt) {
                if (alt.toLowerCase() === $scope.answer.text.toLowerCase()) {
                    $scope.processCard(3);
                    $scope.answer.assessment = 'correct';
                    ratedCorrect = true;
                }
            });

            if (!ratedCorrect) {
                $scope.processCard(0);
            }
        };


        $scope.processCard = function (rating) {


            $scope.$parent.recordRate($scope.card, Date.now(), rating);

        };




        $document.bind('keypress', function (event) {

            if($scope.mode !== 'images' || $scope.assess !== 'auto') {
                return;
            }



            if ($state.$current.url.source !== '/practice/:courseId') {
                return;
            }


            if ($scope.state === 'question' && event.keyCode === 13) {
                $scope.showAnswer();
                return;
            }


            if ($scope.state === 'answer' && event.keyCode === 13) {
                $scope.nextCard();
                return;
            }





        });

        $scope.nextCard = function () {

            console.log('next card');

            $scope.$parent.nextCard();
            $scope.state = 'question';

            $scope.answer.text = '';

            $timeout(function () {
                angular.element('.focus').trigger('focus');
            }, 100);
        };


    }]);