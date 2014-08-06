'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$state', '$modalInstance', '$location', '$timeout', 'Authentication',
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
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                //If successful we assign the response to the global user model

                $scope.authentication.user = response;
                $modalInstance.close();
                $location.path('/');
                $state.go($state.$current, null, {reload: true});
                //And redirect to the index page
//                $location.path('/');
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
//                console.log($modalInstance);
                //$modalInstance.close();
                //And redirect to the index page

//                $timeout(function(){
//                $location.path('/');
//                },100);

            }).error(function(response) {
                $scope.error = response.message;
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);