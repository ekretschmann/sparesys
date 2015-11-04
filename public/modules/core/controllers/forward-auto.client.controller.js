'use strict';


// Courses controller
angular.module('core').controller('ForwardAutoController', ['$scope', '$state', '$document', '$timeout',
    function ($scope, $state, $document, $timeout) {


        $scope.answer = {};
        $scope.answer.text = '';
        $scope.answer.assessment = undefined;
        $scope.specialChars = [];


        $scope.init = function () {
            $scope.state = 'question';
            $scope.setSpecialCharacters();
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


            $scope.answer.text = '';


            $scope.setSpecialCharacters();


            $state.go($state.$current);

        };

        $scope.recording = false;

        $scope.stopRecording = function () {
            $scope.recording = !$scope.recording;
        };

        $scope.startRecording = function (card) {
            /* jshint ignore:start */
            $scope.recognition = new webkitSpeechRecognition();
            $scope.recognition.continuous = false;
            $scope.recognition.interimResults = true;
            $scope.recognition.lang = card.languageBack.code;
            $scope.recognition.onresult = $scope.onSpeechResult;

            $scope.recognition.onstart = function () {
                console.log('start');
                $scope.answer.text = 'xxxxx';
                $scope.recording = true;
            };

            $scope.recognition.onerror = function (event) {

                console.log('error');
                console.log(event);
            };
            $scope.recognition.onend = function () {
                console.log('end');

                //recognition.start();
            };

            console.log('and starting');
            $scope.recognition.start();
            /* jshint ignore:end */
        };

        $scope.onSpeechResult = function (event) {
            //console.log('result');
            /* jshint ignore:start */

            // console.log(event.results);//
            // console.log(event.resultIndex);

            var interim_transcript = '';
            var final_transcript = '';
            if (typeof(event.results) === 'undefined') {
//                    console.log('ending');
                $scope.recognition.onend = null;
                $scope.recognition.stop();
//                    upgrade();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {


                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }


            }
            //console.log('i'+interim_transcript);
            //console.log('f'+final_transcript);
            $scope.answer.text = final_transcript;
            /* jshint ignore:end */

        };


    }]);
