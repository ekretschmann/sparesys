'use strict';

// Schools controller
angular.module('schools').controller('SchoolsController', ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Schools',
	function($scope, $stateParams, $location, $modal, Authentication, Schools ) {
		$scope.authentication = Authentication;

        $scope.addTeacherToSchoolPopup = function (size) {
            $modal.open({
                templateUrl: 'addTeacherToSchool.html',
                controller: 'AddTeacherToSchoolController',
                size: size,
                resolve: {
                    course: function () {
                        return $scope.school;
                    }
                }
            });
        };


        $scope.areYouSureToSubscribePopoup = function (school) {

            $scope.school = school;
            $modal.open({
                templateUrl: 'areYouSureToSubscribeToSchool.html',
                controller: 'SubscribeToSchoolModalController',
                resolve: {

                    school: function () {
                        return $scope.school;
                    }
                }
            });

        };

        $scope.areYouSureToDeleteSchool = function (school) {

            $scope.school = school;
            $modal.open({
                templateUrl: 'areYouSureToDeleteSchool.html',
                controller: 'DeleteSchoolModalController',
                resolve: {

                    school: function () {
                        return $scope.school;
                    }
                }
            });

        };



        // Find list for current user
        $scope.findForCurrentUser = function () {
            if ($scope.authentication.user) {
                $scope.schools = Schools.query({
                    userId: $scope.authentication.user._id
                }, function(schools) {
                    if (schools.length === 1) {
                        $location.path('schools/'+schools[0]._id+'/edit');
                    }
                });
            }
        };

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
				$location.path('schools/' + response._id +'/edit');
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
		$scope.findForUser = function() {

            $scope.school = Schools.query({
                teachers: Authentication.user._id
            }, function(schools) {
                $scope.school= schools[0];
            });
		};

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