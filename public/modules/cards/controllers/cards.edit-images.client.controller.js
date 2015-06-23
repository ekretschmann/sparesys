'use strict';

angular.module('cards').controller('EditCardImagesController', ['$scope', '$modal',
    function ($scope, $modal) {





        $scope.manageImages = function () {

            if (!$scope.hasImageMode) {
                return;
            }

            $modal.open({
                templateUrl: 'manageImages.html',
                controller: 'ManageImagesController',
                resolve: {
                    card: function () {
                        return $scope.card;
                    }
                }
            });
        };




        $scope.toggleMode = function () {


            var mode = 'images';
            if ($scope.card.modes.indexOf(mode) === -1) {
                $scope.card.modes.push(mode);
                //$scope.hasImageMode = true;


            } else {
                for (var i in $scope.card.modes) {
                    if ($scope.card.modes[i] === mode) {
                        $scope.card.modes.splice(i, 1);
                    }
                }
                //$scope.hasImageMode = false;
            }
             $scope.updateCard();

        };

        $scope.toggleImagesShowText = function() {

            $scope.card.imagesShowText = !$scope.card.imagesShowText;
            $scope.updateCard();
        };

        $scope.toggleImagesReadFront = function() {

            $scope.card.imagesReadFront = !$scope.card.imagesReadFront;
            $scope.updateCard();
        };

        $scope.toggleImagesReadBack = function() {

            $scope.card.imagesReadBack = !$scope.card.imagesReadBack;
            $scope.updateCard();
        };

        $scope.toggleImagesRecognizeSpeech = function() {

            $scope.card.speechRecognitionImages = !$scope.card.speechRecognitionImages;
            $scope.updateCard();
        };



        $scope.updateCard = function () {


            $scope.card.$update();

        };



    }
]);
