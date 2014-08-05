'use strict';

angular.module('packs').controller('EditPackController', ['$scope', '$state', '$timeout', '$modalInstance', 'pack', 'Cards',
    function ($scope, $state, $timeout, $modalInstance, pack, Cards) {
        $scope.pack = pack;

        $scope.setFocus = function () {
            $timeout(function () {
                angular.element('.editPackFocus').trigger('focus');
            }, 100);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.ok = function () {

            var courseName = pack.courseName;
            $scope.pack.$update(function () {
                pack.courseName = courseName;
            });


            var cardsToUpdate = pack.cards.length;
            var cardsUpdated = 0;
            pack.cards.forEach(function (card) {
                Cards.get({
                    cardId: card
                }, function (card) {
                    card.due = pack.due;
                    card.after = pack.after;
                    card.$update(function() {
                        cardsUpdated++;
                        if (cardsUpdated === cardsToUpdate) {
                            $state.go($state.$current, null, {reload:true});
                        }
                    });
                });
            });

            $modalInstance.dismiss('cancel');
        };
    }
]);