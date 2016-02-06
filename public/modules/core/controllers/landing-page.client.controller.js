'use strict';

angular.module('core').controller('LandingPageController', ['$window', '$scope', '$modal', 'Authentication',
    function ($window, $scope, $modal, Authentication) {
        $scope.authentication = Authentication;

        $scope.interval = 500;


        $scope.ga = function() {

            console.log('ga landing');
            console.log('/landing');
            if ($window.ga) {
                console.log('sending to ga');
                $window.ga('send', 'pageview', '/landing');
                $window.ga('send', 'event', 'landing page');
            }
        };

        // Set of Photos
        $scope.slides = [
            {image: '/modules/core/img/brand/investigator.png', text: 'You won\'t forget this. Ever.'},
            {image: '/modules/core/img/brand/illustrator.png', text: 'I dare you to become a Rememberator!'},
            {image: '/modules/core/img/brand/philosopher-medium.gif', text: 'I remember, therefore I am.'},
            {image: '/modules/core/img/brand/gator-skater.png', text: 'Unleash your brainpower!'},
            {image: '/modules/core/img/brand/illuminator.png', text: 'Do something worth Remembering!'},
            {image: '/modules/core/img/brand/hibernator.png', text: 'Forget about Forgetting!'}

        ];



        // initial image index
//        $scope.index = Math.floor((Math.random() * 6) + 1);
//        $scope.index = 2;


        $scope.signinPopup = function () {
        };

        $scope.signinPopup = function (size) {

            $modal.open({
                templateUrl: 'signin.html',
                controller: 'LoginController',
                size: size
            });

        };

        $scope.signupPopup = function (size) {
            $modal.open({
                templateUrl: 'signup.html',
                controller: 'LoginController',
                size: size
            });

        };

    }]);
