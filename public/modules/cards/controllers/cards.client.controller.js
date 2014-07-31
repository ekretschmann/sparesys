'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$modal', '$stateParams', '$state', '$location', 'Authentication', 'Packs', 'Cards',
    function ($scope, $modal, $stateParams, $state, $location, Authentication, Packs, Cards) {
        $scope.authentication = Authentication;


        $scope.toggleRead = function (card) {

            card.style[0] = !card.style[0];
            if ($scope.validateToggle(card)) {
                card.$update();
            } else {
                card.style[0] = !card.style[0];
            }
        };

        $scope.toggleWrite = function (card) {

            card.style[1] = !card.style[1];
            if ($scope.validateToggle(card)) {
                card.$update();
            } else {
                card.style[1] = !card.style[1];
            }

        };

        $scope.toggleListen = function (card) {
            card.style[2] = !card.style[2];
            if ($scope.validateToggle(card)) {
                card.$update();
            } else {
                card.style[2] = !card.style[2];
            }
        };

        $scope.multipleChoice = function (card) {
            card.style[3] = !card.style[3];
            if ($scope.validateToggle(card)) {
                card.$update();
            } else {
                card.style[3] = !card.style[3];
            }
        };

        $scope.validateToggle = function (card) {
            if (!card.style[0] && !card.style[1] && !card.style[2] && !card.style[3]) {
                $scope.error = 'You have to leave at least one style switched on';
                return false;
            }
            return true;
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

        // Update existing Card
        $scope.update = function () {
            var card = $scope.card;

            card.$update(function () {
                $location.path('packs/' + card.packs[0]+'/edit');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };

        // Find a list of Cards
        $scope.find = function () {
            $scope.cards = Cards.query();
        };

        // Find existing Card
        $scope.findOne = function () {
            $scope.card = Cards.get({
                cardId: $stateParams.cardId
            });
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