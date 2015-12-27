'use strict';

/* global d3 */
/* jshint ignore:start */
angular.module('core').service('SpeechRecognitionService', ['$q',
    function ($q) {


        this.recognition = undefined;
        this.hasStared = false;

        this.initSpeech = function (card, answer) {

            if (!this.recognition) {
                if ('webkitSpeechRecognition' in window) {
                    this.recognition = new webkitSpeechRecognition();
                }
            }

            var deferred = $q.defer();


            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = card.languageBack.code;


            var rec = this.recognition;
            var gotTheAnswer = false;
            this.recognition.onresult = function (event) {

                //console.log('result');

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

                        //console.log('final');
                        if (!gotTheAnswer) {
                            if (answer.text === undefined) {
                                answer.text = '';
                            }


                            answer.text = event.results[i][0].transcript.trim();

                            if (answer.text === card.question) {
                                console.log('filtering question');
                            } else {

                                if (answer.text.startsWith(card.question)) {
                                    console.log('stripping question');
                                    answer.text = answer.text.substring(card.question.length).trim();
                                }
                                answer.error = false;
                                gotTheAnswer = true;
                                rec.onend(event);
                            }
                        }

                    } else {
                        interim_transcript += event.results[i][0].transcript.trim();

                        //console.log(interim_transcript);
                        if (card.answer.toLowerCase().indexOf(interim_transcript.toLowerCase()) > -1) {
                            answer.text = card.answer;
                            answer.error = false;
                            gotTheAnswer = true;
                            rec.onend(event);

                        }

                        for (var j = 0; j < card.acceptedAnswersForward.length; j++) {
                            var a = card.acceptedAnswersForward[j];
                            if (a.toLowerCase().indexOf(interim_transcript.toLowerCase()) > -1) {
                                answer.text = card.answer;
                                answer.error = false;
                                gotTheAnswer = true;
                                rec.onend(event);
                            }
                        }
                    }

                }

            };

            this.recognition.onstart = function () {
                //console.log('start');
                answer.text = '';
            };


            this.recognition.onerror = function (event) {


                console.log('error');
                answer.error = true;
                console.log(event);
                //rec.stop();
                if (gotTheAnswer) {
                    gotTheAnswer = false;
                    deferred.resolve(answer);
                }
            };

            this.recognition.onend = function (event) {

                //console.log('end');
                //console.log(answer);
                if (gotTheAnswer) {
                    gotTheAnswer = false;
                    deferred.resolve(answer);
                }
                // this.recognition.start();
            };

            if (!this.hasStarted) {
                this.hasStarted = true;
                this.recognition.start();
            }

            return deferred.promise;

        };


    }
]);
/* jshint ignore:end */
