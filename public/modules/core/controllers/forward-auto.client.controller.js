'use strict';


// Courses controller
angular.module('core').controller('ForwardAutoController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {


        $scope.answer = {};
        $scope.answer.text = '';
        $scope.answer.assessment = undefined;
        $scope.specialChars = [];


        $scope.init = function() {
            $scope.state = 'question';
            $scope.setSpecialCharacters();
        };

        $scope.setSpecialCharacters = function () {
            var lang = $scope.card.languageFront.name;

            if ($scope.state === 'question') {
                lang = $scope.card.languageBack.name;
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
            if ($scope.card.readFrontForward && $scope.mode === 'forward' && $scope.assess==='auto') {
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

        $scope.addChar = function(c) {
            if (!$scope.answer.text) {
                $scope.answer.text = '';
            }

            var selectionStart = angular.element('.answer')[0].selectionStart;
            var selectionEnd = angular.element('.answer')[0].selectionEnd;

            $scope.answer.text = $scope.answer.text.substr(0, selectionStart) + c + $scope.answer.text.substr(selectionEnd);
            angular.element('.answer').trigger('focus');
        };


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

            $scope.recordRate(Date.now(), rating );
            $scope.state = 'question';

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

                if ($scope.state === 'question' && event.keyCode === 13 && $scope.answer.text) {
                    $scope.showAnswer();
                    $scope.state = 'answer';

                }
            });

        //};

        $scope.nextCard = function () {

            $scope.$parent.nextCard();


            $scope.answer.text = '';

            $scope.state = 'question';
            $scope.setSpecialCharacters();


            $state.go($state.$current);

        };

    }]);