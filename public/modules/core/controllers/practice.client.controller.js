'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$scope', '$stateParams', 'Courses', 'CoursesService',
    function ($scope, $stateParams, Courses, CoursesService) {

        $scope.time = Date.now();
        $scope.card = {};


        $scope.getPredictedRetention = function (card, time) {

            if (!card) {
                return 0.0;
            }
            if (!card.hrt) {
                return 0.0;
            }
            if (!card.lastRep) {
                card.lastRep = 0;
            }
            var lastRep = card.lastRep;
            var hrt = card.hrt;


            return Math.exp((time - lastRep) / hrt * Math.log(0.5));
        };

        $scope.adjustScoreToDueDate = function(card, time) {
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

                    console.log(card.score);

                    if (card.score < bestValue) {
                        bestCard = card;
                        bestValue = card.score;
                    }
                }
            }, this);
            $scope.card = bestCard;
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


    }]);