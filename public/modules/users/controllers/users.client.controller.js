'use strict';

// Users controller
angular.module('users').controller('UsersController', ['$http', '$scope', '$state', '$timeout', '$modal', '$stateParams', '$location', 'Authentication', 'Users', 'Roles',
    function ($http, $scope, $state, $timeout, $modal, $stateParams, $location, Authentication, Users, Roles) {
        $scope.authentication = Authentication;


        $timeout(function () {
            angular.element('.focus').trigger('focus');
        }, 100);


        $scope.removeReward = function(item, otherUser) {
            for (var i = 0; i < otherUser.inventory.length; i++) {
                if (otherUser.inventory[i].name === item.name) {
                    otherUser.inventory.splice(i,1);
                    otherUser.$update();
                }
            }
        };

        // Remove existing User
        $scope.remove = function (otherUser) {
            if (otherUser) {
                otherUser.$remove(function () {
                    $location.path('users');
                });
            }
        };

        $scope.removeInventories = function () {
            var n = $scope.users.length;
            var i = 0;
            $scope.users.forEach(function (user) {
                user.inventory = [];
                user.$update(function () {
                    i++;

                    if (i === n) {
                        $state.go($state.$current, null, {reload: true});
                    }
                });
            }, this);

        };

        $scope.clearInventory = function (otherUser) {

            otherUser.inventory = [];
            otherUser.$update();


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
            }, function (users) {
                $scope.users = users;

            });
        };

        // Find existing User
        $scope.userRoles = [];
        $scope.findOne = function () {
            $scope.otherUser = Users.get({
                userId: $stateParams.userId
            }, function (u) {
                $scope.roles = Roles.query(function() {
                    for (var i = 0; i < $scope.roles.length; i++) {
                        $scope.userRoles[i] = u.roles.indexOf($scope.roles[i].name) > -1;
                    }
                });

            });


        };

        $scope.updateUserRoles = function() {
            var newRoles = [];
            for (var i = 0; i < $scope.roles.length; i++) {
                if ($scope.userRoles[i]) {
                    newRoles.push($scope.roles[i].name);
                }
            }
            $scope.otherUser.roles = newRoles;
            $scope.otherUser.$update();
        };


        $scope.findById = function (userId) {
            Users.get({
                userId: userId
            }, function (user) {
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


        $scope.removeSchool = function (school, user) {
            user.studentInSchools.splice(user.studentInSchools.indexOf(school), 1);
            user.$update();
        };

        $scope.removeSchoolAdmin = function (school, user) {
            var index = user.administersSchools.indexOf(school._id);
            user.administersSchools.splice(index, 1);
            user.$update();
        };

        // Update existing User
        $scope.update = function () {

            $scope.otherUser.$update(function() {
                $scope.otherUser.password = '';
            });

        };




        // Role management
        //$scope.roles = ['admin', 'user', 'upload-course', 'debug-viewer', 'teacher', 'headmaster', 'help', 'receive-rewards'];

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

        $scope.removeTeacherFromClass = function (otherUser, s) {
            for (var i = 0; i < otherUser.teachesClasses.length; i++) {
                if (otherUser.teachesClasses[i] === s) {
                    otherUser.teachesClasses.splice(i, 1);
                }
            }
            otherUser.$update();
        };

        $scope.removeStudentFromClass = function (otherUser, s) {
            for (var i = 0; i < otherUser.studentInClasses.length; i++) {
                if (otherUser.studentInClasses[i] === s) {
                    otherUser.studentInClasses.splice(i, 1);
                }
            }
            otherUser.$update();
        };

        $scope.areYouSureToDeleteUser = function (user) {

            $modal.open({
                templateUrl: 'areYouSureToDeleteUser.html',
                controller: 'DeleteUserModalController',
                resolve: {

                    user: function () {
                        return user;
                    }
                }
            }).result.then(function () {
                    $state.go($state.$current, null, {reload: true});
                });

        };

        $scope.passwordDetails = {};
        $scope.changeUserPassword = function (otherUser) {
            $scope.success = $scope.error = null;


            $scope.passwordDetails.otherUser = otherUser._id;
            $http.post('/users/admin/password', $scope.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };


    }
]);
