'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$window', '$location', '$scope',
    '$rootScope', '$state', '$modal', '$stateParams', '$timeout', 'Authentication',
    'Courses', 'Cards', 'CoursesService', 'RetentionCalculatorService', 'GaugeService', 'ChallengeCalculatorService',
    'ModeSelectorService', 'SpeechRecognitionService',
    function ($window, $location, $scope, $rootScope, $state, $modal, $stateParams, $timeout, Authentication,
              Courses, Cards, CoursesService, RetentionCalculatorService, GaugeService, ChallengeCalculatorService,
              ModeSelectorService, SpeechRecognitionService) {

        $scope.time = Date.now();
        $scope.card = {};
        $scope.assess = 'self';
        $scope.mode = 'forward';

        $scope.answer = {};
        $scope.doneScore = -1;

        $scope.authentication = Authentication;
        $scope.repeatCard = false;
        $scope.cardsRemembered = 0;
        $scope.cardsRepeated = 0;
        $scope.rewardScore = 0;

        $scope.progress = 30;

        $scope.receiveRewards = '';
        $scope.options = {};
        $scope.options.dueDateOnly = false;
        $scope.options.repeatOnly = false;

        $scope.delta = {};






        $scope.lastRepetition = new Date(Date.now);





        $scope.stopPracitcing = function () {
            $location.path('/');
        };







        $scope.soundSupport = false;



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

            //if ($rootScope.online) {
            $scope.recordRateOnline(time, assessment);
            //    return;
            //}
            //
            //
            //$scope.card.hrt = RetentionCalculatorService.calculateFor($scope.card, time, assessment);
            //
            //var hrt = $scope.card.hrt;
            //
            //$localForage.getItem('cards').then(function(data) {
            //    var offlineResults = data;
            //
            //    if(!offlineResults) {
            //        offlineResults = [];
            //    }
            //    offlineResults.push({id: $scope.card._id, assessment: assessment, time: time, hrt: hrt});
            //    $localForage.setItem('cards', offlineResults);
            //
            //});
            //
            //
            //$scope.card.history.push({when: time, assessment: assessment, hrt: $scope.card.hrt});
            //
            //if (assessment === 0 && $scope.assess === 'auto') {
            //    $scope.repeat = true;
            //} else {
            //    $scope.repeat = false;
            //}


        };

        //$scope.storeOfflineRecords = function(offlineResults) {
        //
        //
        //    offlineResults.forEach(function (point) {
        //
        //
        //        Cards.get({
        //            cardId: point.id
        //        }, function (newCard) {
        //
        //            newCard.hrt = point.hrt;
        //            newCard.history.push({when: point.time, assessment: point.assessment, hrt: point.hrt});
        //            newCard.$update();
        //        });
        //    });
        //
        //
        //
        //    //$localForage.clear();
        //};

        $scope.recordRateOnline = function (time, assessment) {


            //$localForage.getItem('cards').then(function(data) {
            //    var offlineResults = data;
            //
            //    if(offlineResults) {
            //       $scope.storeOfflineRecords(offlineResults);
            //    }
            //});

            $scope.card.hrt = RetentionCalculatorService.calculateFor($scope.card, time, assessment);
            var prediction = RetentionCalculatorService.getPredictedCardRetention($scope.card);

            if (assessment > 0) {
                $scope.cardsRemembered++;
                $scope.rewardScore += (1 - prediction);
            }

            //$scope.delta.number++;
            //$scope.delta.difference += (assessment / 3) - prediction;


            //if ($scope.card.history && $scope.card.history.length > 0) {
            //    if ($scope.delta[$scope.card.packs[0]]) {
            //        var delta = $scope.delta[$scope.card.packs[0]];
            //        $scope.delta[$scope.card.packs[0]] = {
            //            predicted: $scope.card.predictedRetention + delta.predicted,
            //            cards: 1 + delta.cards,
            //            score: assessment + delta.score
            //        };
            //    } else {
            //        $scope.delta[$scope.card.packs[0]] = {
            //            predicted: $scope.card.predictedRetention,
            //            cards: 1,
            //            score: assessment
            //        };
            //    }
            //    //console.log($scope.delta[$scope.card.packs[0]]);
            //}


            $scope.card.history.push({
                when: time,
                assessment: assessment,
                hrt: $scope.card.hrt,
                mode: $scope.mode,
                check: $scope.assess
            });




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


            var predicted = Math.exp((time - lastRep) / hrt * Math.log(0.5));


            return predicted;
        };

        $scope.adjustScoreToPriority = function (card) {
            if (card.priority && card.priority !== 3) {
                var distance = Math.abs(card.predictedRetention - 0.4);

                if (card.predictedRetention > 0.4) {

                    return Math.min(1, Math.max(0, 0.4 + (distance * (0.7 + (card.priority * 0.1)))));

                } else {
                    return Math.min(1, Math.max(0.01, 0.4 - (distance * (0.7 + (card.priority * 0.1)))));
                }
            }
            return card.predictedRetention;
        };

        $scope.adjustScoreToDueDate = function (card, time) {

            if (card.dueDate && card.predictedRetention < 0.99 && new Date(card.dueDate).getTime() >= time) {
                var dueInSecs = new Date(card.dueDate).getTime() - time;
                var dueInDays = dueInSecs / (1000 * 60 * 60 * 24);

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


        $scope.recoverFromReward = function () {
            $scope.cardsRemembered++;
            $scope.nextCard();
        };

        $scope.nextCard = function () {


            if ($scope.authentication.user.roles.indexOf('receive-rewards') > -1) {


                $scope.progress = 100 * $scope.rewardScore / 6.0;

                if ($scope.rewardScore > 6) {

                    $timeout(function () {
                        $scope.rewardScore = 0.0;
                        $scope.mode = 'reward';
                    }, 100);

                    return;
                }
            }

            $scope.time = Date.now();


            var bestValue = 1.0;
            var bestCard;

            $scope.courseRetention = 0;
            $scope.dueRetention = 0;
            $scope.requiredRetention = 0;
            $scope.dueCards = 0;
            $scope.newCards = 0;


            ChallengeCalculatorService.reset();
            ChallengeCalculatorService.setCardTotal(this.cards.length);
            //console.log('');
            for (var i = 0; i < this.cards.length; i++) {

                var card = this.cards[i];

                if ($scope.options.dueDateOnly && (!card.dueDate || $scope.time >= new Date(card.dueDate).getTime())) {
                    continue;
                }

                if ($scope.options.repeatOnly && card.history.length === 0) {
                    continue;
                }

                if (card.startDate || $scope.time < new Date(card.startDate).getTime()) {
                    continue;
                }

                ChallengeCalculatorService.candidateCard();


                card.predictedRetention = $scope.getPredictedRetention(card, $scope.time);

                //var before = card.predictedRetention;
                //var d = 0;
                //
                //if (card.history && card.history.length > 0 && $scope.delta[card.packs[0]]) {
                //
                //    var delta = $scope.delta[card.packs[0]];
                //    d = Math.max(Math.min(1, card.predictedRetention + (delta.score / (3 * delta.cards))), 0.01);
                //}



                card.retention = Math.round(card.predictedRetention * 100);
                card.score = Math.abs(card.predictedRetention - 0.4);

                //console.log(card.question+ ': '+card.predictedRetention+'   '+before+ '   '+(card.predictedRetention-before));
                //console.log(card.question+ ': '+d);

                if (!card.history || card.history.length === 0) {
                    $scope.newCards++;
                    ChallengeCalculatorService.newCard();
                } else {
                    ChallengeCalculatorService.retention(card.predictedRetention);
                    ChallengeCalculatorService.oldCard();
                }

                if (card.dueDate) {
                    card.score = Math.abs($scope.adjustScoreToDueDate(card, Date.now()) - 0.4);
                }

                if (card.priority !== 3) {
                    //console.log('');
                    //console.log('priority '+card.priority);
                    //console.log('before   '+card.score);
                    card.score = Math.abs($scope.adjustScoreToPriority(card) - 0.4);
                    //console.log('after    '+card.score);
                }

                if (card.score < bestValue && card.modes.length > 0) {
                    if (this.cards.length >= 1 && card.question !== $scope.card.question) {
                        bestCard = card;
                        bestValue = card.score;
                    }
                }

                // calculate when am I done
                if (card.dueDate && $scope.time < new Date(card.dueDate).getTime()) {
                    ChallengeCalculatorService.dueCard(card.dueDate, $scope.time, card.predictedRetention);

                }
            }


            if ($scope.repeat) {
                bestCard = $scope.card;
                bestValue = $scope.card.score;
            }

            if (!bestCard) {
                return;
            }

            if (!bestCard.history || bestCard.history.length === 0) {
                ChallengeCalculatorService.newCardAsked();
            }

            GaugeService.loadLiquidFillGauge(ChallengeCalculatorService.getDoneScore(), ChallengeCalculatorService.getColor());

            $scope.challengeName = ChallengeCalculatorService.getChallengeName();
            $scope.challengeDescription = ChallengeCalculatorService.getChallengeDescription();

            $scope.card = bestCard;

            if ($scope.card.history && $scope.card.history.length>0) {
                $scope.lastRepetition = new Date($scope.card.history[$scope.card.history.length-1].when);
            } else {
                $scope.lastRepetition = undefined;
            }

            var repetitionParameters = ModeSelectorService.getRepetitionParameters(bestCard);
            $scope.mode = repetitionParameters.mode;
            $scope.assess = repetitionParameters.assess;


            $scope.cardScore = 0;
            $scope.cardsRepeated++;

            $scope.card.history.forEach(function (time) {
                $scope.cardScore += time.assessment;
            }, this);


            if (!$scope.card.history || $scope.card.history.length === 0) {
                $scope.inPlay++;
            }


            $scope.updateSlides();
            if ($scope.mode === 'forward' && $scope.card.speechRecognitionForward) {
                SpeechRecognitionService.initSpeech();
            }
            if ($scope.mode === 'reverse' && $scope.card.speechRecognitionReverse) {
                SpeechRecognitionService.initSpeech();
            }
            if ($scope.mode === 'images' && $scope.card.speechRecognitionImages) {
                SpeechRecognitionService.initSpeech();
            }


            if ($scope.mode === 'forward') {

                $timeout(function () {
                    angular.element('#focus-question').trigger('focus');
                }, 100);
            }


            if ($scope.mode === 'reverse') {

                $timeout(function () {
                    angular.element('#focus-question-reverse').trigger('focus');
                }, 100);
            }

            if ($scope.mode === 'images') {


                $timeout(function () {
                    angular.element('#focus-question-images').trigger('focus');
                }, 100);
            }

            ChallengeCalculatorService.cardAsked();

            if ($window.ga) {
                $window.ga('send', 'pageview', '/practice/card/:id');
                $window.ga('send', 'event', 'next card');
            }


        };


        $scope.initPractice = function () {


            if ($scope.authentication.user.roles.indexOf('receive-rewards') > -1) {
                $scope.receiveRewards = 'content-header';
            }
            if ($window.ga) {
                $window.ga('send', 'pageview', '/practice/:id');
                $window.ga('send', 'event', 'start practicing');
            }


            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: $stateParams.courseId});
            promise.$promise.then(function (cards) {
                $scope.cards = cards;
                ChallengeCalculatorService.init(cards);
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
                GaugeService.loadLiquidFillGauge(ChallengeCalculatorService.getDoneScore(), ChallengeCalculatorService.getColor());


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

        $scope.optionsModal = function () {
            $modal.open({
                templateUrl: 'practiceOptions.html',
                controller: 'PracticeOptionsController',
                resolve: {
                    options: function () {
                        return $scope.options;
                    },
                    cards: function () {
                        return $scope.cards;
                    }
                }
            });
        };

        $scope.myAnswerCounts = function (answer, mode) {

            $scope.repeat = false;

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


    }]);
