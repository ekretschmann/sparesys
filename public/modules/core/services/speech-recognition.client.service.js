'use strict';

/* global d3 */
angular.module('core').service('SpeechRecognitionService', ['$q',
    function ($q) {



        this.initSpeech = function (card, answer) {

            /* jshint ignore:start */

            var deferred = $q.defer();

            var recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = card.languageBack.code;


            recognition.onresult = function (event) {

                var interim_transcript = '';
                if (typeof(event.results) === 'undefined') {
                    recognition.onend = null;
                    recognition.stop();
                    return;
                }
                for (var i = event.resultIndex; i < event.results.length; ++i) {

                    //if (this.state==='question' && this.practice.direction === 'forward') {
                    if (event.results[i].isFinal) {
                        if (answer.text === undefined) {
                            answer.text = '';
                        }

                        answer.text += event.results[i][0].transcript.trim();
                        //   $state.go($state.$current);
                    } else {
                        interim_transcript += event.results[i][0].transcript.trim();
                    }

                }

            };

            recognition.onstart = function () {
                answer.text = '';
            };

            recognition.onerror = function (event) {

                console.log('error');
                console.log(event);
            };

            recognition.onend = function () {
                deferred.resolve(answer);
               // recognition.start();
            };

            recognition.start();

            return deferred.promise;
            /* jshint ignore:end */
        };



    }
])
;
