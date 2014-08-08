'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$state','$location', 'Users', 'Authentication',
    function ($scope, $http, $state, $location, Users, Authentication) {
        $scope.user = Authentication.user;
        $scope.headmaster = $scope.user.roles.indexOf('headmaster')>0;
        $scope.teacher = $scope.user.roles.indexOf('teacher')>0;

        // If user is not signed in then redirect back home
        if (!$scope.user) $location.path('/');

        // Check if there are additional accounts
        $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
            for (var i in $scope.user.additionalProvidersData) {
                return true;
            }

            return false;
        };

        // Check if provider is already in use with current user
        $scope.isConnectedSocialAccount = function (provider) {
            return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
        };

        // Remove a user social account
        $scope.removeUserSocialAccount = function (provider) {
            $scope.success = $scope.error = null;

            $http.delete('/users/accounts', {
                params: {
                    provider: provider
                }
            }).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.user = Authentication.user = response;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };

        // Update a user profile
        $scope.updateUserProfile = function () {
            $scope.success = $scope.error = null;
            var user = new Users($scope.user);


            if ($scope.teacher === true) {
                if (user.roles.indexOf('teacher')<0) {
                    user.roles.push('teacher');
                }
            } else {
                for (var i in user.roles) {

                    if (user.roles[i] === 'teacher') {
                        user.roles.splice(i, 1);
                    }
                }
            }

            if ($scope.headmaster === true) {
                if (user.roles.indexOf('headmaster')<0) {
                    user.roles.push('headmaster');
                }
            } else {
                for (var j in user.roles) {
                    if (user.roles[j] === 'headmaster') {
                        user.roles.splice(j, 1);
                    }
                }
            }


            user.$update(function (response) {
                $scope.success = true;
                Authentication.user = response;
//                $state.go($state.$current, null, { reload: true });
                $location.path('/');
            }, function (response) {
                $scope.error = response.data.message;
            });
        };

        // Change user password
        $scope.changeUserPassword = function () {
            $scope.success = $scope.error = null;

            $http.post('/users/password', $scope.passwordDetails).success(function (response) {
                // If successful show success message and clear form
                $scope.success = true;
                $scope.passwordDetails = null;
            }).error(function (response) {
                $scope.error = response.message;
            });
        };
    }
]);