'use strict';

angular.module('packs').controller('DeleteCardController', ['$scope', '$state', '$modalInstance', 'card', 'CoursesService',
	function($scope, $state, $modalInstance, card, CoursesService) {
        $scope.card = card;

        $scope.ok = function () {
            CoursesService.removeCard(card, function () {
                $state.go($state.$current, null, { reload: true });
            });
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);