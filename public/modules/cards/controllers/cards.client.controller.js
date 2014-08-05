'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$modal', '$stateParams', '$state', '$location', 'Authentication', 'Packs', 'Cards',
    function ($scope, $modal, $stateParams, $state, $location, Authentication, Packs, Cards) {
        $scope.authentication = Authentication;




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
//            console.log($scope.nextAlternative);
            console.log($scope.card.answer);

            var card = $scope.card;
            card.updated = Date.now();


            card.$update(function (c) {
                console.log(c);
                $location.path('packs/' + card.packs[0]+'/edit');
            }, function (errorResponse) {
                console.log(errorResponse);
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
            }, function() {
                Packs.get({
                    packId: $scope.card.packs[0]
                }, function(pack) {


                    $scope.pack = pack;

                });
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