'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$scope', '$state', '$stateParams', 'Courses', 'Cards', 'CoursesService',
    function ($scope, $state, $stateParams, Courses, Cards, CoursesService) {

        $scope.time = Date.now();
        $scope.card = {};

        $scope.randomize = function(val) {
            return val * (Math.random() / 10.0 + 1.0);
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


            // setting init values for first iteration
            if (!card.history) {
                card.history = [];
            }

            if (assessment === 0) {
                // 30 s
                card.hrt = $scope.randomize(30*1000);
            } else if (assessment === 1) {
                // 5 min
                card.hrt = $scope.randomize(1000 * 60 * 5);
            } else if (assessment === 2) {
                // 1 day
                card.hrt = $scope.randomize(1000 * 60 * 60 * 24);
            } else if (assessment === 3) {
                // 5 days
                card.hrt = $scope.randomize(1000 * 60 * 60 * 24 * 5);
            }

            card.history.push({when: time, assessment: assessment});


            new Cards(card).$update();
            $scope.nextCard();
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
                        bestCard = card;
                        bestValue = card.score;
                    }
                }
            }, this);

            bestCard.modes = ['images'];
            $scope.card = bestCard;
            $scope.mode = bestCard.modes[Math.floor(Math.random() * bestCard.modes.length)];
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