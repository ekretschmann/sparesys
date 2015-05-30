'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$window', '$location', '$scope', '$state', '$modal', '$stateParams', '$timeout', 'Authentication', 'Courses', 'Cards', 'CoursesService', 'RetentionCalculatorService',
    function ($window, $location, $scope, $state, $modal, $stateParams, $timeout, Authentication, Courses, Cards, CoursesService, RetentionCalculatorService) {

        $scope.time = Date.now();
        $scope.card = {};
        $scope.assess = 'self';
        $scope.mode = 'forward';

        $scope.answer = {};
        $scope.doneScore = -1;

        $scope.authentication = Authentication;
        $scope.repeatCard = false;
        $scope.cardsRemembered = 0;
        $scope.rewardScore = 0;

        $scope.progress = 30;

        $scope.receiveRewards = '';

        $scope.stopPracitcing = function () {
            $location.path('/');
        };


        $scope.initSpeech = function () {
//                console.log('got it');
            /* jshint ignore:start */
            $scope.recognition = new webkitSpeechRecognition();


            $scope.recognition.continuous = true;
            $scope.recognition.interimResults = true;


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


            console.log(text);

            if (!lang || !lang.code) {
                return;
            }

            /* jshint ignore:start */
            if (window.SpeechSynthesisUtterance !== undefined) {


                // console.log('playing sound: '+text+ ' ('+lang.code+')');

                var msg = new SpeechSynthesisUtterance(text);
                msg.lang = lang.code;
                window.speechSynthesis.speak(msg);

            }
            /* jshint ignore:end */

        };


        $scope.round = function (num) {
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


            $scope.card.hrt = RetentionCalculatorService.calculateFor($scope.card, time, assessment);

            if (assessment > 0) {
                $scope.cardsRemembered++;
                $scope.rewardScore += (1 - RetentionCalculatorService.getPredictedCardRetention($scope.card));
                //  console.log($scope.rewardScore);
            }

            $scope.card.history.push({when: time, assessment: assessment, hrt: $scope.card.hrt});

            //$scope.card.__v = undefined;

            Cards.get({
                cardId: $scope.card._id
            }, function (newCard) {


                newCard.hrt = RetentionCalculatorService.calculateFor($scope.card, time, assessment);
                newCard.history.push({when: time, assessment: assessment, hrt: $scope.card.hrt});

                if (assessment === 0 && $scope.assess === 'auto') {
                    $scope.repeat = true;
                } else {
                    $scope.repeat = false;
                }

                newCard.$update();
            });

        };


        $scope.getPredictedRetention = function (card, time) {

            if (!card) {
                return 0.0;
            }
            if (!card.hrt) {
                return 0.0;
            }
            var lastRep = card.history[card.history.length - 1].when;
            var hrt = card.hrt;


            return Math.exp((time - lastRep) / hrt * Math.log(0.5));
        };

        $scope.adjustScoreToDueDate = function (card, time) {

            //console.log(card.dueDate);
            //console.log(new Date(time));
            if (card.dueDate && new Date(card.dueDate).getTime() >= time) {
                var dueInSecs = new Date(card.dueDate).getTime() - time;
                var dueInDays = dueInSecs / (1000 * 60 * 60 * 24);

                // console.log(dueInDays);
                if (dueInDays < 9) {
                    var distance = Math.abs(card.predictedRetention - 0.4);
                    var expectedDistance = (dueInDays * 0.1) * distance;


                    if (card.predictedRetention > 0.4) {
                        return 0.4 + expectedDistance;
                    } else {
                        return 0.4 - expectedDistance;
                    }
                }
            }
            return card.predictedRetention;
        };

        //$scope.adjustScoreToDueDate = function (card, time) {
        //
        //    var pr = card.predictedRetention;
        //    if (card.dueDate) {
        //        var dueInSecs = new Date(card.dueDate).getTime() - time;
        //        var dueInDays = dueInSecs / (1000 * 60 * 60 * 24);
        //        var factor = 10 - dueInDays;
        //
        //        //console.log(card.question);
        //        if (factor > 0 && factor < 10) {
        //
        //            var dOptimal = 0.4 - pr;
        //
        //            if (pr > 0.4) {
        //
        //                dOptimal = pr - 0.4;
        //                //var dMaximal = 1 - pr;
        //                return Math.abs(pr - dOptimal/factor -0.4);
        //            } else {
        //                //var dMinimal = pr;
        //
        //                return Math.abs(pr + (dOptimal/factor) - 0.4);
        //            }
        //
        //        }
        //    }
        //    return Math.abs(card.predictedRetention - 0.4);
        //};

        //1. how far away is the card from 0.4
        //2. make this difference smaller by 10-days left


        $scope.recoverFromReward = function () {
            $scope.cardsRemembered++;
            $scope.nextCard();
        };

        $scope.nextCard = function () {


            if ($scope.authentication.user.roles.indexOf('receive-rewards') > -1) {

                //if ($scope.authentication.user.roles.indexOf('debug-viewer') > -1) {
                //    if (($scope.cardsRemembered + 1) % 3 === 0) {
                //
                //        $timeout(function () {
                //            $scope.mode = 'reward';
                //        }, 100);
                //
                //        return;
                //    }
                //} else {

                $scope.progress = 100 * $scope.rewardScore / 6.0;

                if ($scope.rewardScore > 6) {

                    $timeout(function () {
                        $scope.rewardScore = 0.0;
                        $scope.mode = 'reward';
                    }, 100);

                    return;
                }
                //}
            }

            $scope.time = Date.now();

            var bestValue = 1.0;
            var bestCard;

            //console.log('--------');
            $scope.courseRetention = 0;
            $scope.dueRetention = 0;
            $scope.requiredRetention = 0;
            $scope.dueCards = 0;


            this.cards.forEach(function (card) {

                //console.log(card.question);
                if (!card.startDate || $scope.time >= new Date(card.startDate).getTime()) {

                    //var pr = this.getPredictedRetention(card, $scope.time);
                    card.predictedRetention = $scope.getPredictedRetention(card, $scope.time);

                    card.retention = Math.round(card.predictedRetention * 100);

                    card.score = Math.abs(card.predictedRetention - 0.4);

                    if (card.dueDate) {
                        card.score = Math.abs($scope.adjustScoreToDueDate(card, Date.now()) - 0.4);

                    }

                    //console.log('  '+card.predictedRetention);
                    //console.log('  '+card.score);

                    if (card.score < bestValue && card.modes.length > 0) {
                        if (this.cards.length >= 1 && card.question !== $scope.card.question) {
                            bestCard = card;
                            bestValue = card.score;
                        }
                    }
                }
                // calculate when am I done
                if (card.dueDate) {
                    console.log(card.question);
                    var dueInSecs = new Date(card.dueDate).getTime() - $scope.time;
                    var dueInDays = dueInSecs / (1000 * 60 * 60 * 24);
                    $scope.dueRetention += card.predictedRetention;
                    $scope.dueCards++;
                    $scope.requiredRetention += Math.min(0.99, 1 - dueInDays * 0.03);
                    console.log($scope.dueRetention);
                    console.log($scope.requiredRetention);
                }
            }, this);

            if ($scope.repeat) {
                bestCard = $scope.card;
                bestValue = $scope.card.score;
            }

            if (!bestCard) {
                return;
            }


            if ($scope.requiredRetention === 0) {
                $scope.doneScore = -1;
            } else {

                console.log('result:');
                console.log($scope.dueRetention);
                console.log($scope.requiredRetention);

                var currentDoneScore = Math.round(100 * $scope.dueRetention / $scope.requiredRetention);

                if ($scope.doneScore < currentDoneScore) {
                    $scope.doneScore = currentDoneScore;
                }

                console.log($scope.doneScore);


                var green = (Math.round(Math.min(90, $scope.doneScore) * 2));
                var red = (Math.round(Math.max(10, (100 - $scope.doneScore)) * 2));
                var blue = Math.round(Math.min(green, red) / 3);

                red = red.toString(16);
                green = green.toString(16);
                blue = blue.toString(16);
                if (red.length === 1) {
                    red = '0' + red;
                }
                if (green.length === 1) {
                    green = '0' + green;
                }
                if (blue.length === 1) {
                    blue = '0' + blue;
                }

                var col = '#' + red + '' + green + '' + blue;
                $scope.doneColorCode = {'color': col};
            }

            $scope.card = bestCard;

            $scope.mode = bestCard.modes[Math.floor(Math.random() * bestCard.modes.length)];

            $scope.cardScore = 0;

            $scope.card.history.forEach(function (time) {
                $scope.cardScore += time.assessment;
            }, this);


            if (!$scope.card.history || $scope.card.history.length === 0) {
                $scope.inPlay++;
            }
            $scope.assess = 'self';

            if ($scope.card.check === 'computer') {
                $scope.assess = 'auto';
            }
            if ($scope.assess === 'mixed' && $scope.card.hrt && $scope.card.hrt > 1000 * 60 * 60 * 24 * 5) {
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


            if ($scope.mode === 'forward') {

                $timeout(function () {
                    angular.element('#focus-question').trigger('focus');
                    //  console.log(angular.element('#focus-question'));
                }, 100);
            }


            if ($scope.mode === 'reverse') {

                $timeout(function () {
                    angular.element('#focus-question-reverse').trigger('focus');
                    //  console.log(angular.element('#focus-question'));
                }, 100);
            }

            if ($scope.mode === 'images') {


                $timeout(function () {
                    angular.element('#focus-question-images').trigger('focus');
                    //  console.log(angular.element('#focus-question'));
                }, 100);
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


            if ($scope.authentication.user.roles.indexOf('receive-rewards') > -1) {
                $scope.receiveRewards = 'content-header';
            }
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

        $scope.toDate = function (h) {
            return new Date(h);
        };


        $scope.toHours = function (num) {
            return Math.round(100 * num / 3600000) / 100;
        };


        $scope.toSeconds = function (num) {
            return Math.round(num / 1000);
        };


        $scope.clearCourseHistory = function () {
            $scope.cards.forEach(function (card) {

                $scope.cardsUpdated = 0;

                Cards.get({
                    cardId: card._id
                }, function (newCard) {

                    newCard.history = [];
                    newCard.lastRep = undefined;
                    newCard.hrt = 0.0;
                    newCard.$update(function (card) {
                        $scope.cardsUpdated++;
                        if ($scope.cardsUpdated === $scope.cards.length) {
                            $state.go($state.$current, null, {reload: true});
                        }
                    }, function (err) {
                        console.log(err);
                    });
                });

            });

        };


        $scope.myAnswerCounts = function (answer, mode) {

            // console.log($scope.answer);


            $modal.open({
                templateUrl: 'myAnswerCounts.html',
                controller: 'MyAnswerCountsModalController',
                resolve: {
                    answer: function () {
                        return answer;
                    },
                    mode: function () {
                        return mode;
                    },
                    card: function () {
                        return $scope.card;
                    },
                    supervised: function () {
                        return $scope.course.supervised;
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
