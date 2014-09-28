'use strict';

angular.module('users').controller('LoginController', ['$scope', '$http', '$state', '$modalInstance', '$location', '$timeout', 'Authentication',
    function($scope, $http, $state, $modalInstance, $location, $timeout, Authentication) {
        $scope.authentication = Authentication;

        $scope.credentials = {};
        //If user is signed in then redirect back home
        if ($scope.authentication.user) $location.path('/');

        $scope.setFocus = function () {
            $timeout(function(){
                angular.element('.focus').trigger('focus');
            },100);
        };


        $scope.signup = function() {
            $scope.error = undefined;
            if ($scope.credentials.password && $scope.credentials.password_repeat) {
                if ($scope.credentials.password !== $scope.credentials.password_repeat) {
                    $scope.error = 'passwords do not match';
                    return;
                }
            }
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                //If successful we assign the response to the global user model
                $scope.authentication.user = response;
                $modalInstance.close();
                $location.path('/');
                $state.go($state.$current, null, {reload: true});
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                //If successful we assign the response to the global user model
                $scope.authentication.user = response;
                $modalInstance.close();
                $location.path('/');
                $state.go($state.$current, null, {reload: true});
            }).error(function(response) {
                $scope.error = response.message;
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);