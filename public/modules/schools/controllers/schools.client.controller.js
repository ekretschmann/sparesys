'use strict';

// Schools controller
angular.module('schools').controller('SchoolsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Schools',
	function($scope, $stateParams, $location, Authentication, Schools ) {
		$scope.authentication = Authentication;

		// Create new School
		$scope.create = function() {
			// Create new School object
			var school = new Schools ({
				name: this.name,
                city: this.city,
                country: this.country
			});

			// Redirect after save
			school.$save(function(response) {
				$location.path('schools/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing School
		$scope.remove = function( school ) {
			if ( school ) { school.$remove();

				for (var i in $scope.schools ) {
					if ($scope.schools [i] === school ) {
						$scope.schools.splice(i, 1);
					}
				}
			} else {
				$scope.school.$remove(function() {
					$location.path('schools');
				});
			}
		};

		// Update existing School
		$scope.update = function() {
			var school = $scope.school ;

			school.$update(function() {
				$location.path('schools/' + school._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Schools
		$scope.find = function() {
			$scope.schools = Schools.query();
		};

		// Find existing School
		$scope.findOne = function() {
			$scope.school = Schools.get({ 
				schoolId: $stateParams.schoolId
			});
		};
	}
]);