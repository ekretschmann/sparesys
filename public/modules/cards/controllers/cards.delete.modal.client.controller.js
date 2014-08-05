'use strict';

angular.module('packs').controller('DeleteCardController', ['$scope', '$state', '$location','$modalInstance', 'card', 'CoursesService',
	function($scope, $state, $location, $modalInstance, card, CoursesService) {
        $scope.card = card;

        $scope.ok = function () {
            var packId = $scope.card.packs[0];
            CoursesService.removeCard(card, function () {
                if ($state.$current.url.source === '/packs/:packId/edit') {
                    $state.go($state.$current, null, {reload:true});
                } else {
                    $location.path('packs/' + packId + '/edit');
                }

//                $state.go($state.$current, null, { reload: true });
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);