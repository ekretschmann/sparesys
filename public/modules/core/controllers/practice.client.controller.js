'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$scope', '$state', '$stateParams', 'Courses', 'Cards', 'CoursesService', 'RetentionCalculatorService',
    function ($scope, $state, $stateParams, Courses, Cards, CoursesService, RetentionCalculatorService) {

        $scope.time = Date.now();
        $scope.card = {};
        $scope.assess = 'self';
        $scope.mode = 'reverse';

        $scope.answer = {};



        $scope.initSpeech = function () {
//                console.log('got it');
            /* jshint ignore:start */
            $scope.recognition = new webkitSpeechRecognition();

            console.log( $scope.recognition);

            $scope.recognition.continuous = true;
            $scope.recognition.interimResults = true;


            console.log( $scope.card);

            $scope.recognition.lang = $scope.card.languageBack.code;


            $scope.recognition.onresult = $scope.onSpeechResult;

            $scope.recognition.onstart = function () {
                    console.log('start');
                $scope.answer.text = '';
            };

            $scope.recognition.onerror = function (event) {

                    console.log('error');
                console.log(event);
            };
            $scope.recognition.onend = function () {
                    console.log('end');
                    recognition.start();
            };

                console.log('and starting');
            $scope.recognition.start();
            /* jshint ignore:end */
        };

        $scope.onSpeechResult = function (event) {
            /* jshint ignore:start */


            console.log('result');
            var interim_transcript = '';
            if (typeof(event.results) === 'undefined') {
//                    console.log('ending');
                $scope.recognition.onend = null;
                $scope.recognition.stop();
//                    upgrade();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {

                if ($scope.state==='question' && $scope.practice.direction === 'forward') {
                    if (event.results[i].isFinal) {
                        if ($scope.answer.text === undefined) {
                            $scope.answer.text = '';
                        }

                        $scope.answer.text += event.results[i][0].transcript.trim();
                        $state.go($state.$current);
                    } else {
                        interim_transcript += event.results[i][0].transcript.trim();
                    }
                }
            }
            /* jshint ignore:end */

        };




        $scope.playSound = function (lang, text) {


            /* jshint ignore:start */
            if (window.SpeechSynthesisUtterance !== undefined) {

                console.log('playing sound: '+text+ ' ('+lang.code+')');


                var msg = new SpeechSynthesisUtterance(text);


                msg.lang = lang.code;
                window.speechSynthesis.speak(msg);
            }
            /* jshint ignore:end */

        };



        $scope.round = function(num) {
            return Math.round(10000 * num) / 10000;
        };


        $scope.updateSlides = function () {
            $scope.slides = [];


            $scope.card.images.forEach(function (img) {
                var slide = {};
                slide.image = img;
                $scope.slides.push(slide);
            }, this);

        };

        $scope.recordRate = function (card, time, assessment) {


            card.hrt = RetentionCalculatorService.calculateFor(card, time, assessment);


            card.history.push({when: time, assessment: assessment, hrt:card.hrt});


            new Cards(card).$update();

        };



        $scope.getPredictedRetention = function (card, time) {

            if (!card) {
                return 0.0;
            }
            if (!card.hrt) {
                return 0.0;
            }
            var lastRep = card.history[card.history.length-1].when;
            var hrt = card.hrt;


            return Math.exp((time - lastRep) / hrt * Math.log(0.5));
        };

        $scope.adjustScoreToDueDate = function (card, time) {
            var weight = 1;
            if (card.due) {
                var dueInSecs = new Date(card.due).getTime() - time;
                var dueInDays = dueInSecs / (1000 * 60 * 60 * 24);
                var factor = 10 - dueInDays;

                if (factor > 0 && factor < 10) {
                    weight = ((factor + 2) / 4);
                }
            }
            return weight;
        };

        $scope.nextCard = function () {

            $scope.time = Date.now();

            var bestValue = 1.0;
            var bestCard;
            this.cards.forEach(function (card) {

                console.log(card.question);
                console.log(card.startDate);
                if (!card.startDate || $scope.time >= new Date(card.startDate).getTime()) {

                    var pr = this.getPredictedRetention(card, $scope.time);
                    card.predictedRetention = $scope.getPredictedRetention(card, $scope.time);
                    card.score = Math.abs(pr - 0.4) * $scope.adjustScoreToDueDate(card, $scope.time);

                    if (card.score < bestValue && card.modes.length > 0) {
                    //if (card.question === 'eins') {
                        bestCard = card;
                        bestValue = card.score;
                    }
                }
            }, this);

            //bestCard.modes = ['images'];
            $scope.card = bestCard;
            $scope.mode = bestCard.modes[Math.floor(Math.random() * bestCard.modes.length)];
            $scope.assess = 'self';
            if ($scope.card.hrt && $scope.card.hrt > 1000*60*60*24*5) {
                $scope.assess = 'auto';
            }

            $scope.assess = 'auto';

            $scope.updateSlides();
            if ($scope.mode === 'forward' && $scope.card.speechRecognitionForward) {
                $scope.initSpeech();
            }
            if ($scope.mode === 'reverse' && $scope.card.speechRecognitionReverse) {
                $scope.initSpeech();
            }
            if ($scope.mode === 'images' && $scope.card.speechRecognitionImages) {
                $scope.initSpeech();
            }
            $state.go($state.current);
        };


        $scope.initPractice = function () {

            var res = CoursesService.serverLoadCards();
            res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                $scope.cards = cards;
                $scope.inPlay = cards.length;
                $scope.cards.forEach(function (c) {

                    if (c.history.length === 0) {
                        $scope.inPlay--;
                    }
                });
                $scope.nextCard();

            });

            Courses.get({
                courseId: $stateParams.courseId
            }, function (course) {
                $scope.course = course;


            });
        };

        $scope.toDate = function(h) {
            return new Date(h);
        };


        $scope.toHours = function(num) {
            return Math.round(100 * num / 3600000) / 100;
        };


        $scope.round = function(num) {
            return Math.round(10000 * num) / 10000;
        };



        $scope.clearCourseHistory = function () {
            $scope.cards.forEach(function (card) {
                $scope.clearHistory(card);

            });
            $state.go($state.$current, null, { reload: true });
        };

        $scope.clearHistory = function (card) {
            card.history = [];
            card.lastRep = undefined;
            card.hrt = 0.0;


            new Cards(card).$update(function(c) {
                console.log(c);
            });


        };

        $scope.myAnswerCounts = function(answer) {
            console.log('that counts');
            console.log($scope.card);
            console.log($scope.mode);

            if (!$scope.card.supervisor) {
                if ($scope.mode === 'reverse') {
                    $scope.card.acceptedAnswersReverse.push(answer);
                } else {
                    $scope.card.acceptedAnswersForward.push(answer);
                }

                new Cards($scope.card).$update();

            }
        };


    }]);