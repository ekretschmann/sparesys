'use strict';

/* global d3 */
/* jshint ignore:start */
angular.module('core').service('SpeechRecognitionService', ['$q',
    function ($q) {


        this.recognition = new webkitSpeechRecognition();

        this.initSpeech = function (card, answer) {

            if (!this.recognition) {
                this.recognition = new webkitSpeechRecognition();
            }



            var deferred = $q.defer();

            
            this.recognition.continuous = false;
            this.recognition.interimResults = true;
            this.recognition.lang = card.languageBack.code;


            var rec = this.recognition;
            var gotTheAnswer = false;
            this.recognition.onresult = function (event) {


                var interim_transcript = '';
                if (typeof(event.results) === 'undefined') {
                    this.recognition.onend = null;
                    this.recognition.stop();
                    return;
                }


                for (var i = event.resultIndex; i < event.results.length; ++i) {

                   // console.log(event);

                    //if (this.state==='question' && this.practice.direction === 'forward') {
                    if (event.results[i].isFinal) {
                        if (!gotTheAnswer) {
                            if (answer.text === undefined) {
                                answer.text = '';
                            }


                            answer.text = event.results[i][0].transcript.trim();

                            if (answer.text.substring(0, 3).toLowerCase() === 'um ') {
                                answer.text = answer.text.substring(3);
                            }
                        }

                    } else {
                        interim_transcript += event.results[i][0].transcript.trim();

                        if (interim_transcript.indexOf(card.answer) > -1) {
                            answer.text = card.answer;
                            gotTheAnswer = true;
                            rec.onend(event);

                        }
                    }

                }

            };

            this.recognition.onstart = function () {
                answer.text = '';
            };


            this.recognition.onerror = function (event) {

                answer.error = true;
                rec.stop();
                deferred.resolve(answer);
            };

            this.recognition.onend = function () {
                deferred.resolve(answer);
               // this.recognition.start();
            };

            this.recognition.start();

            return deferred.promise;

        };



    }
]);
/* jshint ignore:end */
