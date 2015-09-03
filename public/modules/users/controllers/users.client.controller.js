'use strict';

// Users controller
angular.module('users').controller('UsersController', ['$scope', '$state','$timeout', '$stateParams', '$location', 'Authentication', 'Users',
    function ($scope, $state, $timeout, $stateParams, $location, Authentication, Users) {
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

        $scope.removeInventories = function() {
            var n = $scope.users.length;
            var i = 0;
            $scope.users.forEach(function(user) {
                user.inventory = [];
                user.$update(function(){
                    i++;

                    if(i===n) {
                        $state.go($state.$current, null, { reload: true });
                    }
                });
            }, this);

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

        $scope.options = {};
        $scope.updateSearch = function () {


            Users.query({
                text: $scope.options.searchText
            }, function(users) {
                $scope.users = users;

            });
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


        $scope.removeSchool = function(school, user) {
            user.studentInSchools.splice(user.studentInSchools.indexOf(school), 1);
            user.$update();
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
        $scope.roles = ['admin', 'user', 'upload-course', 'debug-viewer', 'teacher', 'headmaster', 'help', 'receive-rewards'];

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

        $scope.removeTeacherFromClass = function(otherUser, s) {
            for(var i=0; i<otherUser.teachesClasses.length; i++) {
                if (otherUser.teachesClasses[i] === s) {
                    otherUser.teachesClasses.splice(i, 1);
                }
            }
            otherUser.$update();
        };

    }
]);
