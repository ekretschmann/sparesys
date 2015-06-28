'use strict';


// Courses controller
angular.module('core').controller('ReverseAutoController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {

        $scope.answer = {};
        $scope.answer.text = '';
        $scope.answer.assessment = undefined;

            $scope.state = 'question';



        $scope.setSpecialCharacters = function () {
            if (!$scope.card.languageFront && $scope.state === 'question') {
                return;
            }
            if (!$scope.card.languageBack && $scope.state === 'answer') {
                return;
            }
            var lang = $scope.card.languageBack.name;

            if ($scope.state === 'question') {
                lang = $scope.card.languageFront.name;
            }

            $scope.specialChars = [];
            if (lang === 'Spanish') {
                $scope.specialChars = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];
            } else if (lang === 'French') {
                $scope.specialChars = ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û'];
            } else if (lang === 'German') {
                $scope.specialChars = ['ä', 'é', 'ö', 'ü', 'ß'];
            }
        };

        $scope.$watch('card', function() {
            if ($scope.card.readFrontReverse && $scope.mode === 'reverse' && $scope.assess==='auto') {
                $scope.$parent.playSound($scope.card.languageBack, $scope.card.answer);

                if($scope.card.answerExtension) {
                    $scope.$parent.playSound($scope.card.languageBack, $scope.card.answerExtension);
                }
            }
        });

        $scope.$watch('state', function() {
            if ($scope.state === 'answer' && $scope.card.readBackReverse) {
                $scope.$parent.playSound($scope.card.languageFront, $scope.card.question);
            }

        });




        $scope.addChar = function(c) {
            if (!$scope.answer.text) {
                $scope.answer.text = '';
            }

            var selectionStart = angular.element('.answer')[0].selectionStart;
            var selectionEnd = angular.element('.answer')[0].selectionEnd;

            $scope.answer.text = $scope.answer.text.substr(0, selectionStart) + c + $scope.answer.text.substr(selectionEnd);
            //angular.element('.answer').trigger('focus');
        };

        $scope.showAnswer = function () {


            var ratedCorrect = false;

            $scope.answer.assessment = 'wrong';
            if ($scope.card.question.toLowerCase() === $scope.answer.text.toLowerCase()) {
                $scope.processCard(3);
                $scope.answer.assessment = 'correct';
                ratedCorrect = true;
            }


            $scope.card.acceptedAnswersReverse.forEach(function (alt) {
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
            $state.go($state.current);

        };


        $scope.processCard = function (rating) {

            $scope.$parent.recordRate(Date.now(), rating);
            $scope.state = 'question';

        };



        $document.bind('keypress', function (event) {

            $state.go($state.current);



            if($scope.mode !== 'reverse' || $scope.assess !== 'auto') {
                return;
            }

            if ($state.$current.url.source !== '/practice/:courseId') {
                return;
            }


            if ($scope.state === 'question' && event.keyCode === 13 && $scope.answer.text) {
                $scope.showAnswer();
                return;
            }

            if ($scope.state === 'question') {
                return;
            }

            if ($scope.state === 'answer' && event.keyCode === 13) {
                $scope.nextCard();
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

            $scope.state = 'question';
            $scope.$parent.nextCard();


            $scope.answer.text = '';

            //$timeout(function () {
            //    angular.element('.focus').trigger('focus');
            //}, 100);
        };

    }]);