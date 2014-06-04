'use strict';

// Courses controller
angular.module('courses').controller('UsersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Users',
    function($scope, $stateParams, $location, Authentication, Users) {
        $scope.authentication = Authentication;

//        // Create new Course
//        $scope.create = function() {
//        	// Create new Course object
//            var course = new Courses({
//                name: this.name
//            });
//
//            // Redirect after save
//            course.$save(function(response) {
//                $location.path('courses/' + response._id);
//            }, function(errorResponse) {
//				$scope.error = errorResponse.data.message;
//			});
//
//            // Clear form fields
//            this.name = '';
//        };
//
//        // Remove existing Course
//        $scope.remove = function(course) {
//            if (course) {
//                course.$remove();
//
//                for (var i in $scope.courses) {
//                    if ($scope.courses[i] === course) {
//                        $scope.courses.splice(i, 1);
//                    }
//                }
//            } else {
//                $scope.course.$remove(function() {
//                    $location.path('courses');
//                });
//            }
//        };

//        // Update existing Course
//        $scope.update = function() {
//            var course = $scope.course;
//
//            course.$update(function() {
//                $location.path('courses/' + course._id);
//            }, function(errorResponse) {
//				$scope.error = errorResponse.data.message;
//			});
//        };

        // Find a list of Courses
        $scope.find = function() {

            $scope.users = Users.query();
        };

//        // Find existing Course
//        $scope.findOne = function() {
//            $scope.course = Courses.get({
//                courseId: $stateParams.courseId
//            });
//        };
    }
]);