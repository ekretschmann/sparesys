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
                $scope.playSound($scope.card.languageFront, $scope.card.question);
            }
        });

        $scope.$watch('state', function() {
            console.log('state changed');
            if ($scope.state === 'answer' && $scope.card.readBackForward) {
                console.log('here');
                $scope.playSound($scope.card.languageBack, $scope.card.answer);
            }
        });

        $scope.playSound = function (lang, text) {

            /* jshint ignore:start */
            if (window.SpeechSynthesisUtterance !== undefined) {


                var msg = new SpeechSynthesisUtterance(text);

                msg.lang = lang.code;
                window.speechSynthesis.speak(msg);
            }
            /* jshint ignore:end */

        };






        $scope.showAnswer = function () {

            $scope.state = 'answer';
            $state.go($state.current);


            $scope.answer.assessment = 'wrong';
            if ($scope.card.answer.toLowerCase() === $scope.answer.text.toLowerCase()) {
                $scope.processCard(3);
                $scope.answer.assessment = 'correct';
            }


            $scope.card.alternativesFront.forEach(function (alt) {
                if (alt.toLowerCase() === $scope.answer.text.toLowerCase()) {
                    $scope.processCard(3);
                    $scope.answer.assessment = 'correct';
                }
            });
        };


        $scope.processCard = function (rating) {


            $scope.$parent.recordRate($scope.card, Date.now(), rating);

        };





        $document.bind('keypress', function (event) {

            if($scope.$parent.mode !== 'forward' || $scope.$parent.assess !== 'auto') {
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

            if ($scope.state === 'question') {
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

        $scope.nextCard = function () {

            $scope.$parent.nextCard();
            $scope.state = 'question';

            $scope.answer.text = '';

            $timeout(function () {
                angular.element('.focus').trigger('focus');
            }, 100);
        };

    }]);