'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Packs', 'Cards',
    function($scope, $stateParams, $location, Authentication, Packs, Cards) {
        $scope.authentication = Authentication;


        $scope.clearCards = function() {
            $scope.cards.forEach(function(card) {
                if (card.packName === 'undefined') {
                    //card.$remove();
                    console.log('remove '+card.question);
                }
            });
        };


        // Create new Card
        $scope.create = function() {
        	// Create new Card object
            var card = new Cards({
                name: this.name
            });

            // Redirect after save
            card.$save(function(response) {
                $location.path('cards/' + response._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

            // Clear form fields
            this.name = '';
        };

        // Remove existing Card
        $scope.remove = function(card) {
            if (card) {
                card.$remove();

                for (var i in $scope.cards) {
                    if ($scope.cards[i] === card) {
                        $scope.cards.splice(i, 1);
                    }
                }
            } else {
                $scope.card.$remove(function() {
                    $location.path('cards');
                });
            }
        };

        // Update existing Card
        $scope.update = function() {
            var card = $scope.card;

            card.$update(function() {
                $location.path('cards/' + card._id);
            }, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
        };

        // Find a list of Cards
        $scope.find = function() {
            $scope.cards = Cards.query();
        };

        // Find existing Card
        $scope.findOne = function() {
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

    }
]);