'use strict';


// Courses controller
angular.module('core').controller('PracticeController', ['$localForage', '$window', '$location', '$scope',
    '$rootScope', '$state', '$modal', '$stateParams', '$timeout', 'Authentication',
    'Courses', 'Cards', 'Users', 'CoursesService', 'RetentionCalculatorService', 'DiagramsGaugeService', 'ChallengeCalculatorService',
    'ModeSelectorService', 'SpeechRecognitionService', 'PracticeOptionsService',
    function ($localForage, $window, $location, $scope, $rootScope, $state, $modal, $stateParams, $timeout, Authentication,
              Courses, Cards, Users, CoursesService, RetentionCalculatorService, DiagramsGaugeService, ChallengeCalculatorService,
              ModeSelectorService, SpeechRecognitionService, PracticeOptionsService) {

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
        $scope.startTime = Date.now;
        $scope.endTime = Date.now;


        $scope.delta = {};

        $scope.error = undefined;


        $scope.speechRate = 4;
        $scope.speechIcons = 3;
        $scope.maxScoreForOldCards = 0.3999;


        $scope.rateHover = function (value) {
            PracticeOptionsService.rateHover(value);
        };

        $scope.rateClick = function () {
            PracticeOptionsService.rateClick();

        };

        $scope.$watch(function () {
            //return $scope.card._id;
            return PracticeOptionsService.speechRate;
        }, function () {
            $scope.speechRate = PracticeOptionsService.speechRate;
            $scope.speechIcons = Math.floor($scope.speechRate / 2) + 1;
        });


        $scope.lastRepetition = new Date(Date.now);
        $scope.options = {};
        $scope.toggleOptions = function (option) {

            if (option === 'repeatOnly') {
                PracticeOptionsService.repeatOnly = !PracticeOptionsService.repeatOnly;
                $scope.options.repeatOnly = PracticeOptionsService.repeatOnly;
            }

            if (option === 'selfChecksOnly') {
                PracticeOptionsService.selfChecksOnly = !PracticeOptionsService.selfChecksOnly;
                $scope.options.selfChecksOnly = PracticeOptionsService.selfChecksOnly;
            }


        };

        $scope.stopPracitcing = function () {
            $location.path('/');
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

        $scope.elapsedTime = 0;
        $scope.recordRate = function (time, assessment) {

            $scope.endTime = Date.now();

            $scope.elapsedTime = $scope.endTime - $scope.startTime;


            if ($scope.mode === 'forward' && $scope.card.timedForward) {
                if ($scope.card.limitForward * 1000 < $scope.elapsedTime) {
                    assessment--;
                }

                if ($scope.card.limitForward * 2000 < $scope.elapsedTime) {
                    assessment--;
                }
            }

            if ($scope.mode === 'reverse' && $scope.card.timedReverse) {
                if ($scope.card.limitRevers * 1000 < $scope.elapsedTime) {
                    assessment--;
                }

                if ($scope.card.limitReverse * 2000 < $scope.elapsedTime) {
                    assessment--;
                }
            }

            assessment = Math.max(0, assessment);


            $scope.assessment = assessment;

            $scope.recordRateOnline(time, assessment);

            //if ($rootScope.online) {
            //    $scope.recordRateOnline(time, assessment);
            //    return;
            //}
            //
            //
            //$scope.card.hrt = RetentionCalculatorService.calculateFor($scope.card, time, assessment);
            //
            //var hrt = $scope.card.hrt;
            //
            //$localForage.getItem('cards').then(function (data) {
            //    var offlineResults = data;
            //
            //    if (!offlineResults) {
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

        $scope.storeOfflineRecords = function (offlineResults) {


            offlineResults.forEach(function (point) {


                Cards.get({
                    cardId: point.id
                }, function (newCard) {

                    newCard.hrt = point.hrt;
                    newCard.history.push({when: point.time, assessment: point.assessment, hrt: point.hrt});
                    newCard.$update();
                });
            });


            //$localForage.clear();
        };

        $scope.recordRateOnline = function (time, assessment) {


           // console.log('recording: '+$scope.card.question);
           // console.log('time     : '+time);
           // console.log('assessmet: '+assessment);

            //$localForage.getItem('cards').then(function(data) {
            //    var offlineResults = data;
            //
            //    if(offlineResults) {
            //       $scope.storeOfflineRecords(offlineResults);
            //    }
            //});

            //if ($scope.card.history && $scope.card.history[0]) {
            //    console.log('history  : ' + $scope.prettyPrintHrt($scope.card.history[$scope.card.history.length - 1].hrt));
            //}
            //console.log('old hrt  : '+$scope.prettyPrintHrt($scope.card.hrt));

            $scope.card.hrt = RetentionCalculatorService.calculateFor($scope.card, time, assessment);
            var prediction = RetentionCalculatorService.getPredictedCardRetention($scope.card);

            if (assessment > 0) {
                $scope.cardsRemembered++;
                $scope.rewardScore += (1 - prediction);
            }



            // prolong well known cards
            if ($scope.assess === 'self' && assessment === 3) {
                if ($scope.elapsedTime < 3000) {
                    $scope.card.hrt = $scope.card.hrt * Math.abs(5000 - $scope.elapsedTime) / 1000;
                }
            }

            if ($scope.assess === 'computer' && assessment === 3) {
                if ($scope.elapsedTime < 5000) {
                    $scope.card.hrt = $scope.card.hrt * Math.abs(7000 - $scope.elapsedTime) / 1500;
                }
            }




            //console.log('new hrt  : '+$scope.prettyPrintHrt($scope.card.hrt));


            $scope.card.history.push({
                when: time,
                assessment: assessment,
                hrt: $scope.card.hrt,
                mode: $scope.mode,
                check: $scope.assess
            });

            //if ($scope.card.history && $scope.card.history[0]) {
            //    console.log('history  : ' + $scope.prettyPrintHrt($scope.card.history[$scope.card.history.length - 1].hrt));
            //}


            var hrtEntry = $scope.card.hrt;
            if (assessment === 0 && $scope.assess === 'auto') {
                $scope.repeat = true;
            } else {
                $scope.repeat = false;
            }

            Cards.get({
                cardId: $scope.card._id
            }, function (newCard) {

                console.log('saving '+newCard.question);


                if (newCard.history && newCard.history[0]) {
                    console.log('history  : ' + $scope.prettyPrintHrt(newCard.history[newCard.history.length - 1].hrt));
                }
                console.log('old hrt  : '+$scope.prettyPrintHrt(newCard.hrt));


                newCard.hrt = hrtEntry;
                newCard.history.push({when: time, assessment: assessment, hrt: newCard.hrt});



                console.log('new hrt  : '+$scope.prettyPrintHrt(newCard.hrt));
                if (newCard.history && newCard.history[0]) {
                    console.log('history  : ' + $scope.prettyPrintHrt(newCard.history[newCard.history.length - 1].hrt));
                }



                newCard.$update(function (resp) {
                    //console.log(resp);
                    //$scope.error = undefined;
                }, function (z) {
                    $scope.error = 'Error message: ' + z.data.message;
                });
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

        $scope.challengeData = {};
        $scope.exportChallengeData = function () {
            $scope.challengeData = ChallengeCalculatorService.exportData();
        };

        $scope.orderedCards = [];

        $scope.nextCard = function () {


            if ($scope.authentication.user.roles.indexOf('receive-rewards') > -1) {

                var factor = 6.0;

                $scope.progress = 100 * $scope.rewardScore / factor;

                if ($scope.rewardScore > factor) {

                    $scope.authentication.user.trophies++;
                    Users.get({
                        userId: $scope.authentication.user._id
                    }, function (usr) {
                        usr.trophies = $scope.authentication.user.trophies;
                        usr.$update();
                    });

                    $scope.rewardScore = $scope.rewardScore - factor;
                    $scope.progress = 100 * $scope.rewardScore / factor;

                    //$scope.authentication.user.save();
                }
            }

            $scope.time = Date.now();


            var bestValue = 1.0;
            var bestCard;
            var bestCards = [];

            $scope.courseRetention = 0;
            $scope.dueRetention = 0;
            $scope.requiredRetention = 0;
            $scope.dueCards = 0;
            $scope.newCards = 0;


            ChallengeCalculatorService.reset();
            ChallengeCalculatorService.setCardTotal(this.cards.length);
            $scope.orderedCards = [];
            for (var i = 0; i < this.cards.length; i++) {


                var card = this.cards[i];


                if (PracticeOptionsService.dueDateOnly && (!card.dueDate || $scope.time >= new Date(card.dueDate).getTime())) {

                    continue;
                }


                if (PracticeOptionsService.repeatOnly && card.history.length === 0) {
                    continue;
                }


                if (card.startDate || $scope.time < new Date(card.startDate).getTime()) {
                    continue;
                }

                // ChallengeCalculatorService.candidateCard();


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


                if (card.dueDate) {
                    card.score = Math.abs($scope.adjustScoreToDueDate(card, Date.now()) - 0.4);
                }

                if (card.priority !== 3) {
                    card.score = Math.abs($scope.adjustScoreToPriority(card) - 0.4);
                }


                // calculate when am I done
                if (card.dueDate && $scope.time < new Date(card.dueDate).getTime()) {
                    ChallengeCalculatorService.dueCard(card.dueDate, $scope.time, card.predictedRetention);

                }

                if (!card.history || card.history.length === 0) {
                    $scope.newCards++;
                    ChallengeCalculatorService.newCard();
                } else {

                    if (card.predictedRetention < 0.4 && (card.score > $scope.maxScoreForOldCards)) {
                        card.score = $scope.maxScoreForOldCards;
                    }
                    ChallengeCalculatorService.retention(card.predictedRetention, card.score);
                    ChallengeCalculatorService.oldCard();
                }


                if (card.score <= bestValue && card.modes.length > 0) {

                    if (card.score === bestValue) {

                        if (bestCards.length === 0) {
                            bestCards.push(card);

                        } else {
                            if (card.packs[0] === bestCards[0].packs[0]) {
                                bestCards.push(card);
                            }
                        }

                    } else {
                        bestCards = [];
                        bestCards.push(card);
                    }

                    bestValue = card.score;
                    //console.log(bestCards);
                }


                var cardSummary = {
                    hrt: 0,
                    new: card.history.length === 0,
                    name: card.question,
                    score: Math.round(card.score * 10000) / 10000,
                    predictedRetention: Math.round(card.predictedRetention * 1000) / 1000,
                    due: card.dueDate
                };

                if (card.history && card.history.length > 0) {
                    cardSummary.hrt = Math.round((100 * card.history[card.history.length - 1].hrt) / (3600 * 1000)) / 100;
                }

                $scope.orderedCards.push(cardSummary);

            }

            function compare(a, b) {
                if (a.score < b.score)
                    return -1;
                if (a.score > b.score)
                    return 1;
                return 0;
            }

            $scope.orderedCards.sort(compare);

            // ChallengeCalculatorService.exportData();


            if ($scope.repeat) {
                bestCard = $scope.card;
                bestValue = $scope.card.score;
            } else {
                bestCard = bestCards[Math.floor(Math.random() * bestCards.length)];
            }


            if (!bestCard) {
                return;
            }

            if (!bestCard.history || bestCard.history.length === 0) {
                ChallengeCalculatorService.newCardAsked();
            }

            DiagramsGaugeService.loadLiquidFillGauge(ChallengeCalculatorService.getDoneScore(), ChallengeCalculatorService.getColor());

            $scope.challengeName = ChallengeCalculatorService.getChallengeName();
            $scope.challengeDescription = ChallengeCalculatorService.getChallengeDescription();

            $scope.card = bestCard;

            $scope.startTime = Date.now();

            if ($scope.card.history && $scope.card.history.length > 0) {
                $scope.lastRepetition = new Date($scope.card.history[$scope.card.history.length - 1].when);
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
            //if ($scope.mode === 'forward' && $scope.card.speechRecognitionForward) {
            //    SpeechRecognitionService.initSpeech();
            //}
            //if ($scope.mode === 'reverse' && $scope.card.speechRecognitionReverse) {
            //    SpeechRecognitionService.initSpeech();
            //}
            //if ($scope.mode === 'images' && $scope.card.speechRecognitionImages) {
            //    SpeechRecognitionService.initSpeech();
            //}


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


            $scope.exportChallengeData();
        };


        $scope.initPractice = function () {




            //if ($scope.authentication.user.roles.indexOf('receive-rewards') > -1) {
            //    $scope.receiveRewards = 'content-header';
            //}
            if ($window.ga) {
                $window.ga('send', 'pageview', '/practice/:id');
                $window.ga('send', 'event', 'start practicing');
            }



            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: $stateParams.courseId});
            promise.$promise.then(function (cards) {

                console.log('xxxx');
                console.log(cards);
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
                //DiagramsGaugeService.loadLiquidFillGauge(ChallengeCalculatorService.getDoneScore(), ChallengeCalculatorService.getColor());


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


        $scope.prettyPrintHrt = function (hrt) {

            var d = Math.floor(hrt / (1000*24*60*60));
            hrt = hrt - d*1000*24*60*60;
            var h = Math.floor(hrt / (1000*24*60));
            hrt = hrt - h*1000*24*60;
            var m = Math.floor(hrt / (1000*24));
            hrt = hrt - m*1000*24;
            var s = Math.floor(hrt / (1000));

            if (d===0) {
                if (h===0){
                    return m+'m '+s+'s';
                } else {
                    return h+ 'h '+m+'m ';
                }
            } else {
                return d+'d '+h+ 'h ';
            }


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


    }])
;
