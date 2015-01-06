'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$modal', '$timeout', '$stateParams', '$state', '$location', 'Authentication', 'Courses', 'Packs', 'Cards',
    function ($scope, $modal, $timeout, $stateParams, $state, $location, Authentication, Courses, Packs, Cards) {



        $scope.activeTab = 'Card';

        $scope.tabs = [
            { title:'Card', active: true },
            { title:'Forward', active: false },
            { title:'Reverse', active: false },
            { title:'Images', active: false  },
            { title:'MultipleChoice', active: false  }
        ];


        $scope.toggleMode = function(mode) {

            console.log(mode);
            console.log($scope.card.modes);

        };


        $scope.navigateToPack = function (pack) {
            $timeout(function () {
                $location.path('packs/' + pack._id + '/edit');
            }, 500);
        };


        $scope.authentication = Authentication;
        $scope.nextAlternative = undefined;
        $scope.nextAlternativeQuestion = {};
        $scope.nextAlternativeQuestion.text = '';

        $scope.check = 'self-checked for new cards';


        $scope.checks = ['always computer-checked', 'always self-checked', 'self-checked for new cards'];
        $scope.readQuestions = ['yes', 'no'];
        $scope.readAnswers = ['yes', 'no'];
        $scope.directions = ['one way', 'both ways'];

        $scope.modes = ['forward', 'reverse', 'images', 'multiple choice'];



        $scope.languages = [
            {name:'-', code:''},
            {name:'Chinese', code:'zh-CN'},
            {name:'English (GB)', code:'en-GB'},
            {name:'English (US)', code:'en-US'},
            {name:'French', code:'fr-FR'},
            {name:'German', code:'de-DE'},
            {name:'Italian', code:'it-IT'},
            {name:'Japanese', code:'ja-JP'},
            {name:'Korean', code:'ko-KR'},
            {name:'Spanish', code:'es-ES'}
        ];

        var selectedIndex = 0;
        $scope.language = $scope.languages[selectedIndex];

        $scope.setCheck = function (value) {


            if (value.toString() === 'always computer-checked') {
                $scope.card.check = 'checked';
            } else if (value.toString() === 'always self-checked') {
                $scope.card.check = 'self';
            } else {
                $scope.card.check = 'default';
            }

            $scope.card.$update(function (c) {
//                $location.path('packs/' + card.packs[0] + '/edit');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
            $scope.check = value;
        };

        $scope.setSound = function (value) {
            $scope.sound = value;
            if (value === 'yes') {
                $scope.card.sound = true;
            } else if (value === 'no') {
                $scope.card.sound = false;
            }
            $scope.card.$update();
        };

        $scope.setSoundBack = function (value) {
            $scope.soundback = value;
            if (value === 'yes') {
                $scope.card.soundback = true;
            } else if (value === 'no') {
                $scope.card.soundback = false;
            }
            $scope.card.$update();
        };

        $scope.setCardType = function(t) {
            $scope.card.type = t;
            $scope.card.bothways = false;
            $scope.direction = 'one way';
            $scope.card.$update();
        };

        $scope.setDirection = function (value) {
            $scope.direction = value;
            if (value === 'one way') {
                $scope.card.bothways = false;
            } else if (value === 'both ways') {
                $scope.card.bothways = true;
            }
            $scope.card.$update();
        };


        $scope.forwardMuted = '';
        $scope.reverseMuted = '';
        $scope.imagesMuted = '';

        $scope.updateView = function () {

            $scope.card.hasForwardMode = $scope.card.modes && $scope.card.modes.indexOf('forward') !== -1;
            $scope.card.hasReverseMode = $scope.card.modes && $scope.card.modes.indexOf('reverse') !== -1;
            $scope.card.hasImagesMode = $scope.card.modes && $scope.card.modes.indexOf('images') !== -1;

            if ($scope.card.hasForwardMode) {
                $scope.forwardMuted = '';
            } else {
                $scope.forwardMuted = 'text-muted';
            }

            if ($scope.card.hasReverseMode) {
                $scope.reverseMuted = '';
            } else {
                $scope.reverseMuted = 'text-muted';
            }

            if ($scope.card.hasImagesMode) {
                $scope.imagesMuted = '';
            } else {
                $scope.imagesMuted = 'text-muted';
            }

        };



        $scope.switchTab = function(activeTab) {
            $scope.activeTab = activeTab;
        };

        // Find existing Card
        $scope.findOne = function () {

            if($stateParams.tab) {

                $scope.activeTab = $stateParams.tab;

                    $scope.tabs.forEach(function(tab) {
                    if (tab.title === $stateParams.tab) {
                        tab.active = true;
                    } else {
                        tab.active = false;
                    }
                });

            }


            $scope.card = Cards.get({
                cardId: $stateParams.cardId
            }, function () {

                $scope.updateView();


                Courses.get({
                    courseId: $scope.card.course
                }, function(course) {
                    $scope.course = course;
                });

                Packs.get({
                    packId: $scope.card.packs[0]
                }, function (pack) {


                    $scope.pack = pack;
                    var prev;
                    var next;
                    for (var i =0; i< $scope.pack.cards.length; i++) {
                        if ($scope.pack.cards[i]._id === $scope.card._id) {
                            if (i>0) {
                                prev = $scope.pack.cards[i-1]._id;
                            }
                            if (i<$scope.pack.cards.length-1) {
                                next = $scope.pack.cards[i+1]._id;
                            }
                        }
                    }


                    if (next) {
                        Cards.get({
                            cardId: next
                        }, function (nextc) {
                            $scope.nextCard = nextc;
                        });
                    }

                    if (prev) {
                        Cards.get({
                            cardId: prev
                        }, function (prevc) {
                            $scope.prevCard = prevc;
                        });
                    }




                });

            });
        };

        $scope.setFocus = function () {
            $timeout(function () {
                angular.element('.editPackFocus').trigger('focus');
            }, 100);
        };


        $scope.clearCards = function () {
            $scope.cards.forEach(function (card) {
                if (card.packName === 'undefined') {
                    card.$remove(function () {
                        $state.go($state.$current, null, { reload: true });
                    });

                }
            });
        };

        $scope.enterAlternative = function (event) {
            if (event.keyCode === 13) {
                $scope.updateNextAlternative();
            }
        };

        $scope.enterAlternativeQuestion = function (event) {
            if (event.keyCode === 13) {
                $scope.updateNextAlternativeQuestion();
            }
        };

        // Create new Card
        $scope.create = function () {

            // Create new Card object
            var card = new Cards({
                name: this.name
            });

            // Redirect after save
            card.$save(function (response) {
                $location.path('cards/' + response._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            // Clear form fields
            this.name = '';
        };

        // Remove existing Card
        $scope.remove = function (card) {

            if (card) {
                card.$remove();

                for (var i in $scope.cards) {
                    if ($scope.cards[i] === card) {
                        $scope.cards.splice(i, 1);
                    }
                }
            } else {
                $scope.card.$remove(function () {
                    $location.path('cards');
                });
            }
        };

        $scope.updateAnswer = function () {

            if (!$scope.card.answer) {
                if ($scope.card.alternatives[0]) {
                    $scope.card.answer = $scope.card.alternatives[0];
                    $scope.card.alternatives.splice(0, 1);
                }

                if ($scope.card.alternativequestions[0]) {
                    $scope.card.question = $scope.card.alternativequestions[0];
                    $scope.card.alternativequestions.splice(0, 1);
                }
            }
            $scope.update();
        };




        $scope.updateAlternativeQuestion = function (index, alt) {


            $scope.card.alternativequestions[index] = alt;
            var alts = [];
            $scope.card.alternativequestions.forEach(function (alt) {
                if (alt !== undefined && alt !== '') {
                    alts.push(alt);
                }
            });
            $scope.card.alternativequestions = alts;

            console.log($scope.card.alternativequestions);
            $scope.update();
        };

        $scope.updateNextAlternative = function () {




            if ($scope.nextAlternative) {
                $scope.card.alternatives.push($scope.nextAlternative);
                $scope.nextAlternative = undefined;

                $timeout(function () {
                    angular.element('#alternative').trigger('focus');
                }, 100);

            }
            $scope.update();
        };

        $scope.updateNextAlternativeQuestion = function () {

            console.log($scope.nextAlternativeQuestion.text);


            if ($scope.nextAlternativeQuestion.text !== '') {
                $scope.card.alternativequestions.push($scope.nextAlternativeQuestion.text);
                $scope.nextAlternativeQuestion.text = '';

                $timeout(function () {
                    angular.element('#alternativequestion').trigger('focus');
                }, 100);

            }
            $scope.update();
        };


        // Update existing Card
        $scope.update = function () {


            // this is a hack to wait for the date picker to update the model
            // before updating
            $timeout(function () {
                var card = $scope.card;
                card.updated = Date.now();

                if ($scope.nextAlternative) {
                    card.alternatives.push($scope.nextAlternative);
                }

                card.$update(function (c) {
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }, 500);
        };

        // Find a list of Cards
        $scope.find = function () {
            $scope.cards = Cards.query();
        };


        // Find existing Pack
        $scope.findById = function (cardId) {
            $scope.card = Cards.get({
                cardId: cardId
            });
        };

        $scope.getPackName = function (card) {

            Packs.query({
                _id: card.packs[0]
            }, function (packs) {
                if (packs.length === 1) {
                    card.packName = packs[0].name;
                } else {
                    card.packName = 'undefined';
                }
            });


        };


        $scope.swap = function (card) {
            var temp = card.question;
            card.question = card.answer;
            card.answer = temp;
            card.alternatives = [];
            card.$update(function () {
                $state.go($state.$current, null, { reload: true });
            });
        };



        $scope.areYouSureToDeleteCard = function (card) {

            $scope.card = card;

            $modal.open({
                templateUrl: 'areYouSureToDeleteCard.html',
                controller: 'DeleteCardController',
                resolve: {
                    card: function () {
                        return $scope.card;
                    }
                }
            });


        };
    }
]);