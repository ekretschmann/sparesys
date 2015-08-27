'use strict';

angular.module('packs').controller('DeleteCardController', ['$scope', '$state', '$location','$modalInstance', 'Cards', 'card', 'pack',
	function($scope, $state, $location, $modalInstance, Cards, card, pack) {
        $scope.card = card;
        $scope.pack = pack;

        $scope.ok = function () {

            // this is a card within a pack, not a standalone resource
            Cards.get({
                cardId: $scope.card._id
            }, function (c) {
                c.$remove(function() {
                    $modalInstance.close();
                });

            });






        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);