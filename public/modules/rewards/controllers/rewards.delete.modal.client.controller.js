'use strict';

angular.module('packs').controller('DeleteRewardController', ['$scope', '$state', '$location','$modalInstance', 'Rewards', 'reward',
	function($scope, $state, $location, $modalInstance, Rewards, reward) {
        $scope.reward = reward;
        $scope.ok = function () {

            // this is a card within a pack, not a standalone resource
            Rewards.get({
                rewardId: $scope.reward._id
            }, function (r) {
                r.$remove(function() {
                    $modalInstance.close();
                });

            });






        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
	}
]);