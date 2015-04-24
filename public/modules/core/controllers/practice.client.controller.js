'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$window', '$location', '$scope', '$state', '$modal','$stateParams', 'Authentication','Courses', 'Cards', 'CoursesService', 'RetentionCalculatorService',
    function ($window, $location, $scope, $state, $modal, $stateParams, Authentication, Courses, Cards, CoursesService, RetentionCalculatorService) {

        $scope.time = Date.now();
        $scope.card = {};
        $scope.assess = 'self';
        $scope.mode = 'forward';

        $scope.answer = {};

        $scope.authentication = Authentication;


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


            var interim_transcript = '';
            if (typeof(event.results) === 'undefined') {
//                    console.log('ending');
                $scope.recognition.onend = null;
                $scope.recognition.stop();
//                    upgrade();
                return;
            }
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                console.log(i);

                //if ($scope.state==='question' && $scope.practice.direction === 'forward') {
                //    if (event.results[i].isFinal) {
                //        if ($scope.answer.text === undefined) {
                //            $scope.answer.text = '';
                //        }
                //
                //        $scope.answer.text += event.results[i][0].transcript.trim();
                //        $state.go($state.$current);
                //    } else {
                //        interim_transcript += event.results[i][0].transcript.trim();
                //    }
                //}
            }
            /* jshint ignore:end */

        };


        $scope.soundSupport = false;


        $scope.playSound = function (lang, text) {


            if (!lang || !lang.code) {
                return;
            }

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

        $scope.recordRate = function (time, assessment) {

            console.log($scope.card.question);
            console.log(assessment);

            $scope.card.hrt = RetentionCalculatorService.calculateFor($scope.card, time, assessment);

            $scope.card.history.push({when: time, assessment: assessment, hrt:$scope.card.hrt});

            //$scope.card.__v = undefined;

            new Cards($scope.card).$update();

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

                if (!card.startDate || $scope.time >= new Date(card.startDate).getTime()) {

                    //var pr = this.getPredictedRetention(card, $scope.time);
                    card.predictedRetention = $scope.getPredictedRetention(card, $scope.time);


                    card.score = Math.abs(card.predictedRetention - 0.4) * $scope.adjustScoreToDueDate(card, $scope.time);


                    if (card.score < bestValue && card.modes.length > 0) {
                        bestCard = card;
                        bestValue = card.score;
                    }
                }
            }, this);

            $scope.card = bestCard;
            $scope.mode = bestCard.modes[Math.floor(Math.random() * bestCard.modes.length)];

            if(!$scope.card.history || $scope.card.history.length ===0) {
                $scope.inPlay ++;
            }
            $scope.assess = 'self';

            if($scope.card.check === 'computer') {
                $scope.assess = 'auto';
            }
            if ($scope.card.hrt && $scope.card.hrt > 1000*60*60*24*5) {
                $scope.assess = 'auto';
            }


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

            //console.log('ga next card');
            //console.log('/practice/card/:id');
            if ($window.ga) {
                //console.log('sending to ga');
                $window.ga('send', 'pageview', '/practice/card/:id');
                $window.ga('send', 'event', 'next card');
            }
        };


        $scope.initPractice = function () {


                //console.log('ga start practicing');
                //console.log('/practice/:id');
                if ($window.ga) {
                    //console.log('sending to ga');
                    $window.ga('send', 'pageview', '/practice/:id');
                    $window.ga('send', 'event', 'start practicing');
                }


            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: $stateParams.courseId});
            promise.$promise.then(function (cards) {
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
            $scope.course = {};
        };

        $scope.toDate = function(h) {
            return new Date(h);
        };


        $scope.toHours = function(num) {
            return Math.round(100 * num / 3600000) / 100;
        };


        $scope.toSeconds = function(num) {
            return Math.round(num/1000);
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

            card.__v = undefined;
            new Cards(card).$update();


        };

        $scope.myAnswerCounts = function (answer, mode) {

            $scope.answer = answer;
            $scope.mode = mode;

            $modal.open({
                templateUrl: 'myAnswerCounts.html',
                controller: 'MyAnswerCountsModalController',
                resolve: {
                    answer: function () {
                        return $scope.answer;
                    },
                    mode: function () {
                        return $scope.mode;
                    },
                    card: function () {
                        return $scope.card;
                    }
                }
            });
        };


        //$scope.showAnswer = function () {
        //    $scope.state = 'answer';
        //};
        //
        //$scope.processCard = function (rating) {
        //    $scope.recordRate(Date.now(), rating);
        //    $scope.state = 'question';
        //    $scope.nextCard();
        //};


        //hotkeys.bindTo($scope)
        //    .add({
        //        combo: 'ctrl+w',
        //        description: 'blah blah',
        //        callback: function() {
        //            console.log('ctrl w');
        //        }
        //    })
        //    .add ({
        //    combo: 'ctrl+r',
        //    description: 'blah blah',
        //    callback: function() {
        //        console.log('ctrl r');
        //    }
        //});

    }]);