'use strict';

// Cards controller
angular.module('cards').controller('CardsController', ['$scope', '$modal', '$timeout', '$stateParams', '$state', '$location', 'Authentication', 'Packs', 'Cards',
    function ($scope, $modal, $timeout, $stateParams, $state, $location, Authentication, Packs, Cards) {
        $scope.authentication = Authentication;


        $scope.nextAlternative = undefined;


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

        $scope.updateAnswer = function() {
            if (!$scope.card.answer) {
                if ($scope.card.alternatives[0]) {
                    $scope.card.answer = $scope.card.alternatives[0];
                    $scope.card.alternatives.splice(0,1);
                }
            }
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
        };

        $scope.updateNextAlternative = function () {
            if ($scope.nextAlternative) {
                $scope.card.alternatives.push($scope.nextAlternative);
                $scope.nextAlternative = undefined;

                $timeout(function () {
                    angular.element('#alternative').trigger('focus');
                }, 100);

            }
        };



        // Update existing Card
        $scope.update = function () {

            console.log('updating');

            var card = $scope.card;
            card.updated = Date.now();

            if ($scope.nextAlternative) {
                card.alternatives.push($scope.nextAlternative);
            }

            card.$update(function (c) {
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