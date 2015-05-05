'use strict';

// Rewards controller
angular.module('rewards').controller('RewardsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rewards',
	function($scope, $stateParams, $location, Authentication, Rewards) {
		$scope.authentication = Authentication;

		$scope.ingredients = [];

		$scope.addIngredient = function(reward) {

			var found = false;
			$scope.ingredients.forEach(function(ingredient) {
				if (ingredient.name === reward.name) {
					ingredient.amount += 1;
					found = true;
				}
			});

			if (!found) {
				$scope.ingredients.push({name: reward.name, amount: 1});
			}
		};

		// Create new Reward
		$scope.create = function() {
			// Create new Reward object
			var reward = new Rewards ({
				name: this.name
			});

			reward.ingredients = $scope.ingredients;

			$scope.rewards.push(reward);
			// Redirect after save
			reward.$save(function(response) {
				//$location.path('rewards/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		//// Remove existing Reward
		//$scope.remove = function(reward) {
		//	if ( reward ) {
		//		reward.$remove();
        //
		//		for (var i in $scope.rewards) {
		//			if ($scope.rewards [i] === reward) {
		//				$scope.rewards.splice(i, 1);
		//			}
		//		}
		//	} else {
		//		$scope.reward.$remove(function() {
		//			$location.path('rewards');
		//		});
		//	}
		//};
        //
		//// Update existing Reward
		//$scope.update = function() {
		//	var reward = $scope.reward;
        //
		//	reward.$update(function() {
		//		$location.path('rewards/' + reward._id);
		//	}, function(errorResponse) {
		//		$scope.error = errorResponse.data.message;
		//	});
		//};
        //
		// Find a list of Rewards
		$scope.find = function() {
			$scope.rewards = Rewards.query();
		};
        //
		//// Find existing Reward
		//$scope.findOne = function() {
		//	$scope.reward = Rewards.get({
		//		rewardId: $stateParams.rewardId
		//	});
		//};
	}
]);