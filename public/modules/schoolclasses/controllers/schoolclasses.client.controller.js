'use strict';

// Schoolclasses controller
angular.module('schoolclasses').controller('SchoolclassesController', ['$scope', '$modal','$stateParams', '$location', 'Authentication', 'Schoolclasses',
	function($scope, $modal, $stateParams, $location, Authentication, Schoolclasses ) {
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

        // Find list for current user
        $scope.findForCurrentUser = function () {
            if ($scope.authentication.user) {
                $scope.schoolclasses = Schoolclasses.query({
                    userId: $scope.authentication.user._id
                }, function(schoolclasses) {
//                    console.log(schoolclasses);
//                    if (schoolclasses.length === 1) {
//                        $location.path('schools/'+schools[0]._id+'/edit');
//                    }
                });
            }
        };

        $scope.addClassPopup = function (size) {

            $modal.open({
                templateUrl: 'addClass.html',
                controller: 'AddClassController',
                size: size,
                resolve: {
                    classlist: function () {
                        return $scope.schoolclasses;
                    }
                }
            });

        };
	}
]);