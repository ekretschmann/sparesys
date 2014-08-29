'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$modal', '$timeout', '$stateParams', '$state', '$location', 'Authentication', 'Packs', 'Cards',
    function ($scope, $modal, $timeout, $stateParams, $state, $location, Authentication, Packs, Cards) {



        // Set of Photos
        $scope.slides = [
            {image: '/modules/core/img/brand/superhero-girl-medium.gif'},
            {image: '/modules/core/img/brand/superhero-boy-medium.gif'},
            {image: '/modules/core/img/brand/philosopher-medium.gif'},
            {image: '/modules/core/img/brand/guru-medium.gif'},
            {image: '/modules/core/img/brand/teacher-man-medium.gif'},
            {image: '/modules/core/img/brand/teacher-woman-medium.gif'}
        ];


        $scope.authentication = Authentication;
        $scope.nextAlternative = undefined;

        $scope.validation = 'leave unchanged';
        $scope.sound = 'leave unchanged';
        $scope.direction = 'leave unchanged';

        $scope.validations = ['always computer-checked', 'always self-checked', 'self-checked for new cards'];
        $scope.readQuestions = ['yes', 'no'];
        $scope.directions = ['one way', 'both ways'];


        // dont know why I have to do this. Seems the checkboxes don't like modal windows
        $scope.setValidation = function(value) {
            $scope.validation = value;
        };

        $scope.setSound = function(value) {
            $scope.sound = value;
        };

        $scope.setDirection = function(value) {
            $scope.direction = value;
        };

        // Find existing Card
        $scope.findOne = function () {
            $scope.card = Cards.get({
                cardId: $stateParams.cardId
            }, function () {

                if ($scope.card.validation === 'self') {
                    $scope.validation = 'always self-checked';
                } else if ($scope.card.validation === 'checked') {
                    $scope.validation = 'always computer-checked';
                } else {
                    $scope.validation = 'self-checked for new cards';
                }

                if ($scope.card.bothways) {
                    $scope.direction = 'both ways';
                } else {
                    $scope.direction = 'one way';
                }

                if ($scope.card.sound) {
                    $scope.sound = 'yes';
                } else {
                    $scope.sound = 'no';
                }


                Packs.get({
                    packId: $scope.card.packs[0]
                }, function (pack) {


                    $scope.pack = pack;

                });
            });
        };

        $scope.setFocus = function () {
            $timeout(function () {
                angular.element('.editPackFocus').trigger('focus');
            }, 100);
        };


        $scope.clearCards = function() {
            $scope.cards.forEach(function(card) {
                if (card.packName === 'undefined') {
                    card.$remove(function() {
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
            }
            $scope.update();
        };


        $scope.updateAlternative = function (index, alt) {

            $scope.card.alternatives[index] = alt;
            var alts = [];
            $scope.card.alternatives.forEach(function (alt) {
                if (alt !== undefined && alt !== '') {
                    alts.push(alt);
                }
            });
            $scope.card.alternatives = alts;
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
//                $location.path('packs/' + card.packs[0] + '/edit');
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


        $scope.swap = function(card) {
            var temp = card.question;
            card.question = card.answer;
            card.answer = temp;
            card.alternatives = [];
            card.$update(function() {
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