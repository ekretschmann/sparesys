'use strict';

angular.module('core').service('ChallengeCalculatorService', [
    function () {

        this.challenge = 'due';
        this.minimalDoneScore = 0;
        this.total = 0;
        this.candidates = 0;
        this.over80 = 0;
        this.old = 0;
        this.new = 0;
        this.dueRetention = 0;
        this.requiredRetention = 0;
        this.cardsProcessed = 0;
        this.highscore = 0;
        this.totalNewCards = 0;


        this.exportData = function() {
            return {
                challenge: this.challenge,
                total: this.total,
                candidates: this.candidates,
                cardsProcessed: this.cardsProcessed,
                oldCards: this.old,
                newCards: this.new,
                doneScore: this.getDoneScore()
            };
        };

        this.init = function(cards) {

            var counter = {};
            cards.forEach(function (c) {
                c.history.forEach(function(h){
                    var d = new Date(h.when);
                    var day = d.getFullYear()+'-'+ d.getMonth()+'-'+ d.getDate();
                    if (counter[day]) {
                        counter[day] = counter[day]+1;
                    } else {
                        counter[day] = 1;
                    }
                });
            });

            Object.keys(counter).forEach(function(score){
                if (counter[score] > this.highscore) {
                    this.highscore = counter[score];
                }
            }, this);

        };

        this.dueCard = function(dueDate, time, predictedRetention) {
            var dueInSecs = new Date(dueDate).getTime() - time;
            var dueInDays = dueInSecs / (1000 * 60 * 60 * 24);
            this.dueRetention += predictedRetention;
            //$scope.dueCards++;
            this.requiredRetention += Math.min(0.99, 1 - dueInDays * 0.03);
        };

        this.cardAsked = function() {
            this.cardsProcessed++;
        };

        this.oldCard = function () {
            this.old++;
        };


        this.newCard = function () {
            this.totalNewCards++;
        };

        this.newCardAsked = function () {
            this.new++;
        };

        this.retention = function (retention) {
            if (retention > 0.8) {
                this.over80++;
            }
        };

        this.candidateCard = function () {
            this.candidates++;
        };

        this.reset = function () {
            this.total = 0;
            this.candidates = 0;
            this.over80 = 0;
            this.old = 0;
            this.dueRetention = 0;
            this.requiredRetention = 0;

        };

        this.setCardTotal = function (total) {
            this.total = total;
        };

        this.getDoneScore = function () {

            var score = 0;
            if (this.challenge === 'due') {

                if (this.requiredRetention > 0) {
                    score = this.getDueDoneScore();
                    if (score < 100) {
                        return score;
                    }
                    this.challenge = 'over80';
                    this.minimalDoneScore = 0;
                } else {
                    this.challenge = 'over80';
                }
            }


            if (this.challenge === 'over80') {
                score = this.getOver80DoneScore();
                if (this.old > 3 && score < 100) {
                    return score;
                }
                this.challenge = '10new';
                this.minimalDoneScore = 0;
            }

            if (this.challenge === '10new') {

                if (this.totalNewCards +this.new > 10) {

                    score = this.get10NewDoneScore();
                    if (score < 100) {
                        return score;
                    }
                    this.challenge = '250cards';
                    this.minimalDoneScore = 0;
                } else {
                    this.challenge = '250cards';
                    this.minimalDoneScore = 0;
                }
            }

            if (this.challenge === '250cards') {
                score = this.get250NewCardsDoneScore();
                if (score < 100) {
                    return score;
                }
                this.challenge = 'highscore';
                this.minimalDoneScore = 0;
            }

            if (this.challenge === 'highscore') {
                score = this.getHighscoreDoneScore();
                if (score < 100) {
                    return score;
                }
                this.challenge = 'none';
                this.minimalDoneScore = 0;
            }

            if (this.challenge === 'none') {
                return 100;
            }

        };

        this.getHighscoreDoneScore = function() {
            var actualScore = Math.round(100 * this.cardsProcessed / this.highscore);
            return this.getReportedDoneScore(Math.min(100, actualScore));
        };

        this.get250NewCardsDoneScore = function() {
            var actualScore = Math.round(100 * this.cardsProcessed / 250);
            return this.getReportedDoneScore(Math.min(100, actualScore));
        };

        this.get10NewDoneScore = function() {
            var actualScore = Math.round(10 * this.new);
            return this.getReportedDoneScore(Math.min(100, actualScore));
        };

        this.getDueDoneScore = function() {
            var actualScore = Math.round(100 * this.dueRetention / this.requiredRetention);
            return this.getReportedDoneScore(Math.min(100, actualScore));
        };

        this.getOver80DoneScore = function() {
            if(!this.old) {
                return this.getReportedDoneScore(0);
            }

            return this.getReportedDoneScore(Math.min(100, Math.round(100*this.over80 / this.old)));
        };

        this.getReportedDoneScore = function(score) {
            if (this.minimalDoneScore < score) {
                this.minimalDoneScore = score;
            }
            return this.minimalDoneScore;
        };

        this.getColor = function () {
            var green = (Math.round(Math.min(90, this.minimalDoneScore) * 2));
            var red = (Math.round(Math.max(10, (100 - this.minimalDoneScore)) * 2));
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

            return '#' + red + '' + green + '' + blue;
        };

        this.getChallengeName = function() {

            switch(this.challenge) {
                case 'due': return 'Get on track!';
                case 'over80': return 'Get all cards above 80%';
                case '10new': return 'Learn 10 new cards';
                case '250cards': return 'Work through 250 questions';
                case 'highscore': return 'Go through more cards than ever!';
                case 'none': return 'You have mastered all challenges';
                default: return 'unknown challenge';
            }
        };

        this.getChallengeDescription = function() {
            switch(this.challenge) {
                case 'due': return 'When you reach 100% you are on track for your goals';
                case 'over80': return 'Make sure you don\'t forget your old cards';
                case '10new': return 'Make sure you learn new things';
                case '250cards': return 'Wreck your brain!';
                case 'highscore': return 'Break your personal best';
                case 'none': return 'You worked very hard! Well done!';
                default: return 'unknown challenge';
            }
        };

    }
]);
