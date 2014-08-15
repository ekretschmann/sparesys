'use strict';

// Journeys controller
angular.module('journeys').controller('JourneysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Journeys',
	function($scope, $stateParams, $location, Authentication, Journeys ) {
		$scope.authentication = Authentication;

		// Create new Journey
		$scope.create = function() {
			// Create new Journey object
			var journey = new Journeys ({
				name: this.name
			});

			// Redirect after save
			journey.$save(function(response) {
				$location.path('journeys/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Journey
		$scope.remove = function( journey ) {
			if ( journey ) { journey.$remove();

				for (var i in $scope.journeys ) {
					if ($scope.journeys [i] === journey ) {
						$scope.journeys.splice(i, 1);
					}
				}
			} else {
				$scope.journey.$remove(function() {
					$location.path('journeys');
				});
			}
		};

		// Update existing Journey
		$scope.update = function() {
			var journey = $scope.journey ;

			journey.$update(function() {
				$location.path('journeys/' + journey._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Journeys
		$scope.find = function() {
			$scope.journeys = Journeys.query();
		};

		// Find existing Journey
		$scope.findOne = function() {
			$scope.journey = Journeys.get({ 
				journeyId: $stateParams.journeyId
			});
		};

        // Find list for current user
        $scope.findForCurrentUser = function () {
            if ($scope.authentication.user) {
                Journeys.query({
                    userId: $scope.authentication.user._id
                }, function (journeys) {

                    if (journeys.length === 1) {
                        $scope.journey = journeys[0];
                    }
                });
            }
        };
	}
]);