'use strict';


// Courses controller
angular.module('core').controller('ForwardAutoController', ['$scope', '$state', '$document', '$timeout', 'SpeechRecognitionService',
    function ($scope, $state, $document, $timeout, SpeechRecognitionService) {


        $scope.answer = {};
        $scope.answer.text = '';
        $scope.answer.error = false;
        $scope.answer.assessment = undefined;
        $scope.specialChars = [];
        $scope.cardRecods = false;


        $scope.init = function () {
            $scope.state = 'question';
            $scope.setSpecialCharacters();
            if ($scope.card.speechRecognitionForward) {
                $scope.cardRecords = true;
            } else {
                $scope.cardRecods = false;
            }
        };

        $scope.setSpecialCharacters = function () {
            if (!$scope.card.languageFront && $scope.state === 'question') {
                return;
            }
            if (!$scope.card.languageBack && $scope.state === 'answer') {
                return;
            }
            var lang = $scope.card.languageFront.name;

            if ($scope.state === 'question' && $scope.card.languageBack) {
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


        $scope.$watch('state', function () {

            if ($scope.state === 'question') {

                $timeout(function () {
                    angular.element('#focus-question').trigger('focus');
                }, 100);
            }
        });



        $scope.addChar = function (c) {
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

            $scope.recordRate(Date.now(), rating);
            $scope.state = 'question';

        };


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
                $timeout(function () {
                    $scope.showAnswer();
                }, 100);

            }
        });

        $scope.nextCard = function () {



            $scope.state = 'question';
            $scope.$parent.nextCard();

          //  console.log($scope.card);
            if ($scope.card.speechRecognitionForward) {


                if ($scope.recording) {
                    $scope.startRecording($scope.card);
                }

                $scope.cardRecords = true;
              //
            } else {
                $scope.cardRecods = false;
            }

           // console.log($scope.cardRecords);

            $scope.answer.text = '';


            $scope.setSpecialCharacters();


//            $state.go($state.$current);

        };

        $scope.startRecording = function (card) {


            $scope.answer.text = '';
            $scope.answer.recognized = false;

            var promise = SpeechRecognitionService.initSpeech(card, $scope.answer);


            $scope.recording = true;


            promise.then(function(x) {
                console.log('receiving ', x.text);
                if (x.error) {
                    $scope.startRecording(card);
                } else {
                    if (x.text === '') {
                        $scope.startRecording(card);
                    } else {
                        $scope.answer.text = x.text;
                        $scope.answer.recognized = true;
                    }
                }
            });


        };




    }]);
