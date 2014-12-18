'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$scope', '$state', '$stateParams', 'Courses', 'CoursesService',
    function ($scope, $state, $stateParams, Courses, CoursesService) {

        $scope.time = Date.now();
        $scope.card = {};



        $scope.recordRate = function(card, time, assessment) {


            // setting init values for first iteration
            if (! card.history) {
                card.history = [];
            }

            if (card.history.length === 0) {
                if (assessment === 0) {
                    // 10 s
                    card.hrt = 10000;
                } else if (assessment === 1) {
                    // 10 min
                    card.hrt = 1000*60*10 * (Math.random()/10.0+1.0);
                } else if (assessment === 2) {
                    // 1 day
                    card.hrt = 1000*60*60*24 * (Math.random()/10.0+1.0);
                } else if (assessment === 3) {
                    // 5 days
                    card.hrt = 1000*60*60*24*5 * (Math.random()/10.0+1.0);
                }
            } else {
                if (assessment === 0) {
                    // 10 s
                    card.hrt = 10000 * (Math.random()/10.0+1.0);
                } else if (assessment === 1) {
                    // 10 min
                    card.hrt = card.hrt / 10;
                } else if (assessment === 2) {
                    // don't change hrt
                } else if (assesment === 3) {

                }
            }

            card.history.push({when: time, assessment: assessment});



        };

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
            console.log('next card');
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

            bestCard.modes=['forward'];
            $scope.card = bestCard;
            $scope.mode = bestCard.modes[Math.floor(Math.random()*bestCard.modes.length)];
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




    }]);