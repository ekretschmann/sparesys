'use strict';

// Schoolclasses controller
angular.module('schoolclasses').controller('SchoolclassesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Schoolclasses',
	function($scope, $stateParams, $location, Authentication, Schoolclasses ) {
		$scope.authentication = Authentication;

		// Create new Schoolclass
		$scope.create = function() {
			// Create new Schoolclass object
			var schoolclass = new Schoolclasses ({
				name: this.name
			});

			// Redirect after save
			schoolclass.$save(function(response) {
				$location.path('schoolclasses/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Schoolclass
		$scope.remove = function( schoolclass ) {
			if ( schoolclass ) { schoolclass.$remove();

				for (var i in $scope.schoolclasses ) {
					if ($scope.schoolclasses [i] === schoolclass ) {
						$scope.schoolclasses.splice(i, 1);
					}
				}
			} else {
				$scope.schoolclass.$remove(function() {
					$location.path('schoolclasses');
				});
			}
		};

		// Update existing Schoolclass
		$scope.update = function() {
			var schoolclass = $scope.schoolclass ;

			schoolclass.$update(function() {
				$location.path('schoolclasses/' + schoolclass._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Schoolclasses
		$scope.find = function() {
			$scope.schoolclasses = Schoolclasses.query();
		};

		// Find existing Schoolclass
		$scope.findOne = function() {
			$scope.schoolclass = Schoolclasses.get({ 
				schoolclassId: $stateParams.schoolclassId
			});
		};
	}
]);