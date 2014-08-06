'use strict';

angular.module('core').controller('HomeController', ['$scope', '$modal', 'Authentication',
    function ($scope, $modal, Authentication) {
        $scope.authentication = Authentication;

        // Set of Photos
        $scope.photos = [
            {src: '/modules/core/img/brand/superhero-girl-medium.gif', text: 'test'},
            {src: '/modules/core/img/brand/superhero-boy-medium.gif', text: 'Image 02'},
            {src: '/modules/core/img/brand/philosopher-medium.gif', text: 'Image 03'},
            {src: '/modules/core/img/brand/guru-medium.gif', text: 'Image 04'},
            {src: '/modules/core/img/brand/teacher-man-medium.gif', text: 'Image 05'},
            {src: '/modules/core/img/brand/teacher-woman-medium.gif', text: 'Image 06'}
        ];

        // initial image index
        $scope.index = Math.floor((Math.random() * 6) + 1);


        $scope.signinPopup = function () {
            console.log('signin');
        };

        $scope.signinPopup = function (size) {

            $modal.open({
                templateUrl: 'signin.html',
                controller: 'AuthenticationController',
                size: size
            });

        };

        $scope.signupPopup = function (size) {
            console.log('sign up');
            $modal.open({
                templateUrl: 'signup.html',
                controller: 'AuthenticationController',
                size: size
            });

        };

    }]);