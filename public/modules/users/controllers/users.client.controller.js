'use strict';

// Courses controller
angular.module('courses').controller('UsersController', ['$scope', '$timeout', '$stateParams', '$location', 'Authentication', 'Users',
    function ($scope, $timeout, $stateParams, $location, Authentication, Users) {
        $scope.authentication = Authentication;



        $timeout(function () {
            angular.element('.focus').trigger('focus');
        }, 100);

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
        // Remove existing User
        $scope.remove = function (otherUser) {
            if (otherUser) {
                otherUser.$remove(function () {
                    $location.path('users');
                });
            }
        };

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
        $scope.find = function () {

            $scope.users = Users.query();
        };

        // Find existing User
        $scope.findOne = function () {
            $scope.otherUser = Users.get({
                userId: $stateParams.userId
            });

        };


        $scope.findById = function (userId) {
            Users.get({
                userId: userId
            }, function(user) {
                $scope.displayName = user.displayName;

            });
        };

        $scope.findStudent = function (userId) {
            $scope.student = Users.get({
                userId: userId
            });
        };

        $scope.findTeacher = function (userId) {
            $scope.teacher = Users.get({
                userId: userId
            });
        };



        $scope.removeSchoolAdmin = function(school, user) {
            var index = user.administersSchools.indexOf(school._id);
            user.administersSchools.splice(index, 1);
            user.$update();
        };

        // Update existing User
        $scope.update = function () {


            if(!$scope.otherUser.administersSchools) {
                $scope.otherUser.administersSchools = [];
            }
            if(!$scope.otherUser.teachesClasses) {
                $scope.otherUser.teachesClasses = [];
            }
            $scope.otherUser.$update(function () {
                $location.path('users');
            });
        };



        // Role management
        $scope.roles = ['admin', 'user', 'upload-course', 'debug-viewer', 'teacher', 'headmaster', 'help'];

        // toggle selection for a given user role
        $scope.toggleSelection = function toggleSelection(toggledRole) {

            function userHasToggledRole() {
                return $scope.otherUser.roles.indexOf(toggledRole) >= 0;
            }

            function removeToggledRole() {
                $scope.otherUser.roles.splice($scope.otherUser.roles.indexOf(toggledRole), 1);
            }

            function addToggledRole() {
                $scope.otherUser.roles.push(toggledRole);
            }


            if (userHasToggledRole()) {
                removeToggledRole();
            } else {
                addToggledRole();
            }
        };

    }
]);