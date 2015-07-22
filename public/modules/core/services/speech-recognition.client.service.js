'use strict';

/* global d3 */
angular.module('core').service('SpeechRecognitionService', [
    function () {


        this.recognition = undefined;

        this.initSpeech = function () {
//                console.log('got it');
            /* jshint ignore:start */
            this.recognition = new webkitSpeechRecognition();


            this.recognition.continuous = true;
            this.recognition.interimResults = true;


            this.recognition.lang = this.card.languageBack.code;


            this.recognition.onresult = this.onSpeechResult;

            this.recognition.onstart = function () {
                console.log('start');
                this.answer.text = '';
            };

            this.recognition.onerror = function (event) {

                console.log('error');
                console.log(event);
            };
            this.recognition.onend = function () {
                console.log('end');
                recognition.start();
            };

            console.log('and starting');
            this.recognition.start();
            /* jshint ignore:end */
        };

        this.onSpeechResult = function (event) {
            /* jshint ignore:start */


            var interim_transcript = '';
            if (typeof(event.results) === 'undefined') {
//                    console.log('ending');
                this.recognition.onend = null;
                this.recognition.stop();
//                    upgrade();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                console.log(i);

                //if (this.state==='question' && this.practice.direction === 'forward') {
                //    if (event.results[i].isFinal) {
                //        if (this.answer.text === undefined) {
                //            this.answer.text = '';
                //        }
                //
                //        this.answer.text += event.results[i][0].transcript.trim();
                //        $state.go($state.$current);
                //    } else {
                //        interim_transcript += event.results[i][0].transcript.trim();
                //    }
                //}
            }
            /* jshint ignore:end */

        };

    }
])
;
