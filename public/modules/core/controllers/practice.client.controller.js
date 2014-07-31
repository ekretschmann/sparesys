'use strict';


// Courses controller
angular.module('core').controller('PracticeController',
    ['$scope', '$q', '$stateParams', '$http', '$state', '$location', '$modal', '$timeout', '$document', 'Authentication', 'Courses', 'Packs', 'Cards', 'PredictiveSchedulerService', 'CoursesService',
        function ($scope, $q, $stateParams, $http, $state, $location, $modal, $timeout, $document, Authentication, Courses, Packs, Cards, SchedulerService, CoursesService) {
            $scope.authentication = Authentication;


            $scope.style = 'read';
            $scope.state = 'question';
            $scope.cards = [];
            $scope.card = undefined;
            $scope.answer = {};
            $scope.analysis = {};
            $scope.keys = [];
            $scope.lastRating = 0;
            $scope.style = 'read';

            $scope.setFocus = function () {
                $timeout(function () {
                    angular.element('.answer').trigger('focus');
                }, 100);
            };
//
            $scope.submitAnswer = function () {


                var expected = $scope.card.answer.toString();
                var dist = $scope.levenshteinDistance(expected, $scope.answer.text) / expected.length;

                if (dist === 0) {
                    $scope.rateCard(3);
                    $scope.lastRating = 3;
                } else if (dist <= 0.2) {
                    $scope.rateCard(2);
                    $scope.lastRating = 2;
                } else if (dist <= 0.4) {
                    $scope.rateCard(1);
                    $scope.lastRating = 1;
                } else {
                    $scope.rateCard(0);
                    $scope.lastRating = 0;
                }
                $scope.showAnswer();
            };

            $scope.levenshteinDistance = function (s, t) {
                if (s.length === 0) return t.length;
                if (t.length === 0) return s.length;

                return Math.min(
                        $scope.levenshteinDistance(s.substr(1), t) + 1,
                        $scope.levenshteinDistance(t.substr(1), s) + 1,
                        $scope.levenshteinDistance(s.substr(1), t.substr(1)) + (s[0] !== t[0] ? 1 : 0)
                );
            };

            $scope.getMaxHrt = function () {
//                    return SchedulerService.getMaxHrt($scope.card, Date.now());

                if ($scope.card) {
                    return SchedulerService.getMaxHrt($scope.card, Date.now());
                }
                return 8;
            };

            $scope.getStyle = function () {
//                console.log('getstyle');
                if ($scope.card.style[0] && !$scope.card.style[1]) {
                    $scope.style = 'read';
                    return;
                }

                if ($scope.card.style[0] && $scope.card.style[1]) {
//                    console.log('  '+$scope.card.hrt / 60000);
//                    console.log('  '+SchedulerService.getMaxHrt($scope.card, Date.now()) / (60000*60*24*7));
                    if (SchedulerService.getMaxHrt($scope.card, Date.now()) > 1000 * 60 * 24 * 7) {

                        $scope.style = 'write';
                        return;
                    }
                    $scope.style = 'read';
                    return;
                }

                $scope.style = 'write';
            };
//
//
            $document.bind('keypress', function (event) {


                if ($scope.state === 'question' && $scope.style === 'write' && event.keyCode === 13) {
                    $scope.submitAnswer();
                    return;
                }

                if ($scope.state === 'question' && $scope.style === 'read' && event.keyCode === 13) {
                    $scope.showAnswer();
                    return;
                }

                if ($scope.state === 'answer' && $scope.style === 'write' && event.keyCode === 13) {
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
                    $scope.card = SchedulerService.nextCard();
                    $scope.getStyle();
                    $scope.analysis = SchedulerService.getAnalysis();
                    $scope.keys = Object.keys($scope.analysis);
                    $scope.state = 'question';
                    $state.go($state.current);
                });

            };
//
            $scope.nextCard = function () {
                $scope.answer.text = '';
                $scope.card = SchedulerService.nextCard();
                $scope.getStyle();
                $scope.analysis = SchedulerService.getAnalysis();
                $scope.keys = Object.keys($scope.analysis);
                $scope.state = 'question';

                $state.go($state.current);

            };

            $scope.getPredictedRetention = function (card) {

                return Math.round(SchedulerService.getPredictedRetention(card, Date.now()) * 100000) / 1000;
            };

            $scope.getCardOrder = function () {
                $scope.cardOrder = SchedulerService.getCardOrder();
            };

            $scope.getPredictedCardRetention = function () {

                return Math.round(SchedulerService.getPredictedRetention($scope.card, Date.now()) * 100);
            };

            $scope.getPredictedCourseRetention = function () {

                return Math.round(SchedulerService.getPredictedCourseRetention(Date.now()) * 100);
            };

            // Find existing Course
            $scope.init = function () {
                var res = CoursesService.serverLoadCards();
                res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                    $scope.cards = cards;
                    SchedulerService.init($scope.cards);
                    $scope.card = SchedulerService.nextCard();
                    $scope.getStyle();
                    $scope.analysis = SchedulerService.getAnalysis();
                    $scope.keys = Object.keys($scope.analysis);
                });

                Courses.get({
                    courseId: $stateParams.courseId
                }, function (course) {
                    $scope.course = course;
                });
            };


            $scope.playSound = function (answer) {

                /* jshint ignore:start */
                if (window.SpeechSynthesisUtterance !== undefined) {
                    var msg = new SpeechSynthesisUtterance(answer);

                    msg.lang = 'es-ES';
                    window.speechSynthesis.speak(msg);
                }
                /* jshint ignore:end */

            };

        }
    ])
;