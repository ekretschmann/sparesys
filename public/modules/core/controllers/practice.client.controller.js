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

            $scope.setFocus = function () {
                $timeout(function () {
                    angular.element('.answer').trigger('focus');
                }, 100);
            };
//
            $scope.submitAnswer = function () {

                if ($scope.card.answer.toString() === $scope.answer.text) {
                    $scope.rateCard(3);
                } else {
                    $scope.rateCard(0);
                }
                $scope.showAnswer();
            };
//
            $scope.getStyle = function () {
                if ($scope.card.style[0]) {
                    $scope.style = 'read';
                    return 'read';
                }
                $scope.style = 'write';
                return 'write';
            };
//
//
            $document.bind('keypress', function (event) {

                if ($scope.state === 'question' && $scope.style === 'write' && event.key === 'Enter') {
                    $scope.submitAnswer();
                    return;
                }

                if ($scope.state === 'question' && $scope.style === 'read' && event.key === 'Enter') {
                    $scope.showAnswer();
                    return;
                }

                if ($scope.state === 'answer' && $scope.style === 'write' && event.key === 'Enter') {
                    $scope.nextCard();
                    return;
                }


                if ($scope.state === 'question') {
                    return;
                }


                if ($scope.state === 'answer') {
                    if (event.key === '1') {
                        $scope.processCard(1);
                    }
                    if (event.key === '2') {
                        $scope.processCard(2);
                    }
                    if (event.key === '3') {
                        $scope.processCard(3);
                    }
                    if (event.key === '0') {
                        $scope.processCard(0);
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
                    $scope.analysis = SchedulerService.getAnalysis();
                    console.log($scope.analysis.keys);
                    $scope.state = 'question';
                    $state.go($state.current);
                });

            };
//
            $scope.nextCard = function () {
                $scope.answer.text = '';
                $scope.card = SchedulerService.nextCard();
                $scope.analysis = SchedulerService.getAnalysis();
                console.log($scope.analysis.keys);
                $scope.state = 'question';

                $state.go($state.current);

            };

            $scope.getPredictedRetention = function (card) {

                return Math.round(SchedulerService.getPredictedRetention(card, Date.now()) * 100000) / 1000;
            };

            $scope.getCardOrder = function() {
                $scope.cardOrder = SchedulerService.getCardOrder();
                console.log($scope.cardOrder);
            };

            $scope.getPredictedCardRetention = function () {

                return Math.round(SchedulerService.getPredictedRetention($scope.card, Date.now()) * 100);
            };

            $scope.getPredictedCourseRetention = function () {

                return Math.round(SchedulerService.getPredictedCourseRetention(Date.now()) * 100);
            };

            // Find existing Course
            $scope.init = function () {
                console.log('INIT');
                var res = CoursesService.serverLoadCards();
                res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                    $scope.cards = cards;
                    SchedulerService.init($scope.cards);
                    $scope.card = SchedulerService.nextCard();
                    $scope.analysis = SchedulerService.getAnalysis();
                    console.log($scope.analysis.keySet());
                });

                Courses.get({
                    courseId: $stateParams.courseId
                }, function (course) {
                    $scope.course = course;
                });
            };

            //
//            $scope.loadSound = function (answer) {
////                console.log('loading sound ' + answer);
//
////                $http({method: 'GET',
////                    url: 'http://translate.google.com/translate_tts?tl=en&q=the%20brown%20fox.',
////                    headers: {'User-Agent': 'Mozilla'}}).
////                    success(function (data, status, headers, config) {
////                        console.log('success');
////                        console.log(data);
////                        console.log(status);
////                        console.log(headers);
////                        console.log(config);
////
////                        // this callback will be called asynchronously
////                        // when the response is available
////                    }).
////                    error(function (data, status, headers, config) {
////                        console.log('failed');
////                        console.log(data);
////                        console.log(status);
////                        console.log(headers);
////                        console.log(config);
////                    });
//
//
//            };
//

        }
    ])
;