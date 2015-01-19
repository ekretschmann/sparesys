'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$scope', '$state', '$stateParams', 'Courses', 'Cards', 'CoursesService', 'RetentionCalculatorService',
    function ($scope, $state, $stateParams, Courses, Cards, CoursesService, RetentionCalculatorService) {

        $scope.time = Date.now();
        $scope.card = {};
        $scope.assess = 'self';
        $scope.mode = 'reverse';






        $scope.playSound = function (lang, text) {

            console.log('playing sound: '+text+ ' ('+lang.code+')');

            /* jshint ignore:start */
            //if (window.SpeechSynthesisUtterance !== undefined) {
            //
            //
            //    var msg = new SpeechSynthesisUtterance(text);
            //
            //
            //    msg.lang = lang.code;
            //    window.speechSynthesis.speak(msg);
            //}
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

            bestCard.modes = ['reverse'];
            $scope.card = bestCard;
            $scope.mode = bestCard.modes[Math.floor(Math.random() * bestCard.modes.length)];
            $scope.assess = 'self';
            if ($scope.card.hrt && $scope.card.hrt > 0) {
                $scope.assess = 'auto';
            }
            $scope.updateSlides();
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
                $state.go($state.$current, null, { reload: true });
            });
        };

        $scope.clearHistory = function (card) {
            card.history = [];
            card.lastRep = undefined;
            card.hrt = 0.0;

            new Cards(card).$update();

            //Cards.get({
            //    cardId: card._id
            //}, function (thecard) {
            //    thecard.hrt = card.hrt;
            //    thecard.history = card.history;
            //    thecard.lastRep = card.lastRep;
            //    thecard.$update();
            //
            //});
        };


    }]);