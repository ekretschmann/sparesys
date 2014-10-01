'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$timeout', '$http', '$state', '$modalInstance', 'Users', 'Authentication', 'user',
    function ($scope, $timeout, $http, $state, $modalInstance, Users, Authentication, user) {

        $scope.roleSettings = {};
        $scope.userDetails = {};
        $scope.userDetails.username = user.username;
        $scope.userDetails.firstName = user.firstName;
        $scope.userDetails.lastName = user.lastName;
        $scope.userDetails.email = user.email;
        $scope.roleSettings.teacher = user.roles.indexOf('teacher') > -1;
        $scope.roleSettings.headmaster = user.roles.indexOf('headmaster') > -1;
        $scope.passwordDetails = {};
        $scope.cancelled = false;

        $timeout(function () {
            angular.element('.focus').trigger('focus');
        }, 100);

        Users.get({
            userId: user._id
        }, function (result) {
            $scope.user = result;
            Authentication.user = result;
        });

        $scope.cancel = function () {
            $scope.cancelled = true;
            $modalInstance.close();
        };

        // Update a user profile
        $scope.changeDetails = function () {
            if ($scope.cancelled) {
                return;
            }
            var teacher = $scope.roleSettings.teacher;
            var headmaster = $scope.roleSettings.headmaster;

            if (teacher === true) {
                if ($scope.user.roles.indexOf('teacher') < 0) {
                    $scope.user.roles.push('teacher');
                }
            } else {
                for (var i in $scope.user.roles) {

                    if ($scope.user.roles[i] === 'teacher') {
                        $scope.user.roles.splice(i, 1);
                    }
                }
            }

            if (headmaster === true) {
                if ($scope.user.roles.indexOf('headmaster') < 0) {
                    $scope.user.roles.push('headmaster');
                }
            } else {
                for (var j in $scope.user.roles) {
                    if ($scope.user.roles[j] === 'headmaster') {
                        $scope.user.roles.splice(j, 1);
                    }
                }
            }

            $scope.user.firstName =  $scope.userDetails.firstName;
            $scope.user.lastName =  $scope.userDetails.lastName;
            $scope.user.email =  $scope.userDetails.email;
            $scope.user.username =  $scope.userDetails.username;


            $scope.user.$update(function () {
                $modalInstance.close();
            });
        };

        // Change user password
        $scope.changePassword = function () {
            console.log('bbb');
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function (response) {

                $modalInstance.close();
            }).error(function (response) {
                $scope.error = response.message;
            });
        };

    }
]);