'use strict';


// Courses controller
angular.module('core').controller('PracticeController',
    ['$scope', '$q', '$stateParams', '$http', '$state', '$location', '$modal', '$timeout', '$document', 'Authentication', 'Courses', 'Packs', 'Cards', 'Messages', 'PredictiveSchedulerService', 'CoursesService',
        function ($scope, $q, $stateParams, $http, $state, $location, $modal, $timeout, $document, Authentication, Courses, Packs, Cards, Messages, SchedulerService, CoursesService) {
            $scope.authentication = Authentication;


            $scope.positiveFeedback = ['legen... wait for it... dary', 'Sweet', 'Epic', 'Great', 'Correct', 'You Rock', 'Wow', 'What an answer', 'Awesome'];
            $scope.negativeFeedback = ['Sorry', 'Nope', 'Not Quite'];
            $scope.correct = $scope.positiveFeedback[0];
            $scope.incorrect = $scope.negativeFeedback[0];
            $scope.slides = [];
            $scope.validation = 'self';
            $scope.state = 'question';
            $scope.cards = [];
            $scope.card = undefined;
            $scope.answer = {};
//            $scope.answer.final_transcript = '';
            $scope.analysis = {};
            $scope.keys = [];
            $scope.lastRating = 0;

            $scope.inPlay = 0;
            $scope.score = 0;
            $scope.cardScore = 0;
            $scope.practice = {};

            $scope.specialChars = [];



            $scope.settext = function() {
                console.log($scope);
                $scope.answer.final_transcript = 'hello world';
            };

            $scope.onSpeechResult = function (event) {
                /* jshint ignore:start */

                console.log('result');
                var interim_transcript = '';
                if (typeof(event.results) === 'undefined') {
                    console.log('ending');
                    recognition.onend = null;
                    recognition.stop();
                    upgrade();
                    return;
                }
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        if ($scope.answer.text === undefined) {
                            $scope.answer.text ='';
                        }

                        $scope.answer.text += event.results[i][0].transcript.trim();
                        $state.go($state.$current);
                        console.log($scope.answer.text);
                        console.log($scope);
                    } else {
                        interim_transcript += event.results[i][0].transcript.trim();
                    }
                }
                /* jshint ignore:end */

            };



            $scope.thatCounts = function() {



                if ($scope.practice.direction === 'forward') {
                    $scope.card.validanswers.push($scope.answer.text);
                } else if ($scope.practice.direction === 'reverse') {
                    $scope.card.validreverseanswers.push($scope.answer.text);
                }

                $scope.card.history.splice($scope.card.history.length-1);
                SchedulerService.record($scope.card, Date.now(), 3);




                if ($scope.card.master) {
                    var msg = new Messages({
                        sender: $scope.authentication.user.displayName,
                        direction: $scope.practice.direction,
                        card: $scope.card.master,
                        content: $scope.answer.text,
                        to: [$scope.card.supervisor]
                    });

                    Cards.get({
                        cardId: $scope.card._id
                    }, function (thecard) {
                        thecard.hrt = $scope.card.hrt;
                        thecard.history = $scope.card.history;
                        thecard.$update(function() {
                            $scope.nextCard();
                        });
                    });

                    msg.$save(function() {
                        $scope.nextCard();
                    });
                } else  {

                    Cards.get({
                        cardId: $scope.card._id
                    }, function (thecard) {
                        thecard.hrt = $scope.card.hrt;
                        thecard.history = $scope.card.history;
                        thecard.validanswers = $scope.card.validanswers;
                        thecard.validreverseanswers = $scope.card.validreverseanswers;
                        thecard.$update(function() {
                            $scope.nextCard();
                        });
                    });

                }


            };


            $scope.typeSpecialChar = function (c) {
                if (!$scope.answer.text) {
                    $scope.answer.text = '';
                }

                var selectionStart = angular.element('.answer')[0].selectionStart;
                var selectionEnd = angular.element('.answer')[0].selectionEnd;

                $scope.answer.text = $scope.answer.text.substr(0, selectionStart) + c + $scope.answer.text.substr(selectionEnd);
                angular.element('.answer').trigger('focus');
            };

            $scope.setFocus = function () {
                $timeout(function () {
                    angular.element('.answer').trigger('focus');
                }, 100);
            };


            $scope.submitAnswer = function () {


                var expected = $scope.card.answer.toString();


                var score = 0;



                if ($scope.practice.direction === 'forward') {
                    if ($scope.card.answer.toLowerCase() === $scope.answer.text.toLowerCase()) {
                        score = 3;
                    }

                    $scope.card.alternatives.forEach(function (alt) {
                        if (alt.toLowerCase() === $scope.answer.text.toLowerCase()) {
                            score = 3;
                        }
                    });

                    $scope.card.validanswers.forEach(function (alt) {
                        if (alt.toLowerCase() === $scope.answer.text.toLowerCase()) {
                            score = 3;
                        }
                    });
                } else {
                    if ($scope.card.question.toLowerCase() === $scope.answer.text.toLowerCase()) {
                        score = 3;
                    }
                    $scope.card.validreverseanswers.forEach(function (alt) {
                        if (alt.toLowerCase() === $scope.answer.text.toLowerCase()) {
                            score = 3;
                        }
                    });
                }


                if (score === 3) {
                    $scope.rateCard(3);
                    $scope.lastRating = 3;
                    $scope.correct = $scope.positiveFeedback[Math.floor((Math.random() * $scope.positiveFeedback.length))];
                } else {
                    $scope.rateCard(0);
                    $scope.lastRating = 0;
                    $scope.incorrect = $scope.negativeFeedback[Math.floor((Math.random() * $scope.negativeFeedback.length))];
                }

//                var dist = $scope.levenshteinDistance(expected, $scope.answer.text) / expected.length;
//
//                if (dist === 0) {
//                    $scope.rateCard(3);
//                    $scope.lastRating = 3;
//                } else if (dist <= 0.2) {
//                    $scope.rateCard(2);
//                    $scope.lastRating = 2;
//                } else if (dist <= 0.4) {
//                    $scope.rateCard(1);
//                    $scope.lastRating = 1;
//                } else {
//                    $scope.rateCard(0);
//                    $scope.lastRating = 0;
//                }
                $scope.showAnswer();
            };

//            $scope.levenshteinDistance = function (s, t) {
//                if (s.length === 0) return t.length;
//                if (t.length === 0) return s.length;
//
//                return Math.min(
//                        $scope.levenshteinDistance(s.substr(1), t) + 1,
//                        $scope.levenshteinDistance(t.substr(1), s) + 1,
//                        $scope.levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
//                );
//            };

            $scope.getMaxHrt = function () {
//                    return SchedulerService.getMaxHrt($scope.card, Date.now());

                if ($scope.card) {
                    return SchedulerService.getMaxHrt($scope.card, Date.now());
                }
                return 8;
            };

            $scope.getValidation = function () {
                if ($scope.card.validation === 'self') {
                    $scope.validation = 'self';

                } else if ($scope.card.validation === 'default') {
                    var hrt = SchedulerService.getMaxHrt($scope.card, Date.now());
                    if (hrt > 1000 * 60 * 60 * 24 * 7) {
                        $scope.validation = 'checked';
                    } else {
                        $scope.validation = 'self';
                    }
                } else {
                    $scope.validation = 'checked';
                }
            };


            $document.bind('keypress', function (event) {


                if ($state.$current.url.source !== '/practice/:courseId') {
                    return;
                }

                if ($scope.state === 'question' && $scope.validation === 'checked' && event.keyCode === 13) {
                    $scope.submitAnswer();
                    return;
                }

                if ($scope.state === 'question' && $scope.validation === 'self' && event.keyCode === 13) {
                    $scope.showAnswer();
                    return;
                }

                if ($scope.state === 'answer' && $scope.validation === 'checked' && event.keyCode === 13) {
                    $scope.nextCard();

                    return;
                }


                if ($scope.state === 'question') {
                    return;
                }


                if ($scope.state === 'answer') {
                    if (event.charCode === 49) {
                        $scope.processCard(1);
                        $scope.lastRating = 1;
                    }
                    if (event.charCode === 50) {
                        $scope.processCard(2);
                        $scope.lastRating = 2;
                    }
                    if (event.charCode === 51) {
                        $scope.processCard(3);
                        $scope.lastRating = 3;
                    }
                    if (event.charCode === 48) {
                        $scope.processCard(0);
                        $scope.lastRating = 0;
                    }
                }

            });
            $scope.showAnswer = function () {

                $scope.state = 'answer';
                $state.go($state.current);
            };

            $scope.clearCourseHistory = function () {
                $scope.cards.forEach(function (card) {
                    $scope.clearHistory(card);
                    $state.go($state.$current, null, { reload: true });
                });
            };

            $scope.clearHistory = function (card) {
                card.history = [];
                card.lastRep = undefined;
                card.hrt = 0.0;

                Cards.get({
                    cardId: card._id
                }, function (thecard) {
                    thecard.hrt = card.hrt;
                    thecard.history = card.history;
                    thecard.lastRep = card.lastRep;
                    thecard.$update();

                });
            };

            $scope.rateCard = function (rating) {
                SchedulerService.record($scope.card, Date.now(), rating);
                Cards.get({
                    cardId: $scope.card._id
                }, function (thecard) {
                    thecard.hrt = $scope.card.hrt;
                    thecard.history = $scope.card.history;
                    thecard.lastRep = $scope.card.lastRep;
                    thecard.$update();

                });

            };

            $scope.processCard = function (rating) {

                SchedulerService.record($scope.card, Date.now(), rating);


                Cards.get({
                    cardId: $scope.card._id
                }, function (thecard) {
                    thecard.hrt = $scope.card.hrt;
                    thecard.history = $scope.card.history;
                    thecard.lastRep = $scope.card.lastRep;
                    thecard.$update();

                    $scope.nextCard();

                });

            };
//
            $scope.nextCard = function () {
                $scope.answer.text = '';
                $scope.card = SchedulerService.nextCard();
                $scope.getValidation();
                if ($scope.card.history.length === 0) {
                    $scope.inPlay++;
                }
                $scope.setScore();
                $scope.setCardScore();
                $scope.analysis = SchedulerService.getAnalysis();
                $scope.keys = Object.keys($scope.analysis);
                $scope.state = 'question';


                if ($scope.card.bothways && Math.random() > 0.5 && $scope.card.history && $scope.card.history.length > 0) {
                    $scope.practice.direction = 'reverse';
                    $scope.practice.question = $scope.card.answer;
                    $scope.practice.answer = $scope.card.question;
                    $scope.practice.format = $scope.card.format;
                    $scope.practice.alternativequestions = $scope.card.alternatives;
                    $scope.practice.alternatives = $scope.card.alternativequestions;
                } else {
                    $scope.practice.direction = 'forward';
                    $scope.practice.question = $scope.card.question;
                    $scope.practice.format = $scope.card.format;
                    $scope.practice.answer = $scope.card.answer;
                    $scope.practice.alternativequestions = $scope.card.alternativequestions;
                    $scope.practice.alternatives = $scope.card.alternatives;
                }

                if (window.SpeechSynthesisUtterance !== undefined) {
                    $scope.practice.sound = $scope.card.sound;

                } else {
                    $scope.practice.sound = false;
                }
                $scope.practice.assessment = $scope.validation;

                $scope.updateSlides();
                $state.go($state.current);


            };

            $scope.updateSlides = function () {
                $scope.slides = [];


                $scope.card.images.forEach(function (img) {
                    var slide = {};
                    slide.image = img;
                    $scope.slides.push(slide);
                }, this);

            };

            $scope.getPredictedRetention = function (card) {

                return Math.round(SchedulerService.getPredictedRetention(card, Date.now()) * 100000) / 1000;
            };

            $scope.getCardOrder = function () {
                $scope.cardOrder = SchedulerService.getCardOrder();
            };

            $scope.setCardScore = function () {

                $scope.cardScore = Math.round(SchedulerService.getPredictedRetention($scope.card, Date.now()) * 100);
            };

            $scope.setScore = function () {

                $scope.score = Math.round(SchedulerService.getPredictedCourseRetention(Date.now()) * 100) * $scope.inPlay;
            };



            // Find existing Course
            $scope.init = function () {









                var res = CoursesService.serverLoadCards();
                res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                    $scope.cards = cards;
                    $scope.inPlay = cards.length;
                    $scope.cards.forEach(function (c) {

                        if (c.history.length === 0) {
                            $scope.inPlay--;
                        }
                    });


                    SchedulerService.init($scope.cards);

                    $scope.nextCard();
                });

                Courses.get({
                    courseId: $stateParams.courseId
                }, function (course) {
                    $scope.course = course;

                    if ($scope.course.language && $scope.course.language.name === 'Spanish') {
                        $scope.specialChars = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'];
                    } else if ($scope.course.language && $scope.course.language.name === 'French') {
                        $scope.specialChars = ['à', 'â', 'ç', 'é', 'è', 'ê', 'ë', 'î', 'ï', 'ô', 'ù', 'û'];
                    } else if ($scope.course.language && $scope.course.language.name === 'German') {
                        $scope.specialChars = ['ä', 'é', 'ö', 'ü', 'ß'];
                    }


//                    if (!('webkitSpeechRecognition' in window)) {
//                        console.log('sorry');
//                    } else {
//
//                        console.log('got it');
//                        /* jshint ignore:start */
//                        var recognition = new webkitSpeechRecognition();
//
//                        recognition.continuous = true;
//                        recognition.interimResults = true;
//
//                        console.log('x');
//                        console.log($scope.course.languageback.code);
//                        console.log('x');
//                        recognition.lang =  $scope.course.languageback.code;
//
//
//                        recognition.onresult = $scope.onSpeechResult;
//
//                        recognition.onstart = function () {
//                            console.log('start');
//                            $scope.answer.text = '';
//                        };
//
//                        recognition.onerror = function (event) {
//
//                            console.log('error');
//                            console.log(event);
//                        };
//                        recognition.onend = function () {
//                            console.log('end');
////                    recognition.start();
//                        };
//
//                        console.log('and starting');
//                        recognition.start();
                        /* jshint ignore:end */

//                    }

                });
            };


            $scope.playSound = function (answer) {


                if (!$scope.course || !$scope.course.language) {
                    return;
                }

                /* jshint ignore:start */
                if (window.SpeechSynthesisUtterance !== undefined) {


                    var msg = new SpeechSynthesisUtterance(answer);

                    msg.lang = $scope.course.language.code;
                    window.speechSynthesis.speak(msg);
                }
                /* jshint ignore:end */

            };

        }
    ])
;