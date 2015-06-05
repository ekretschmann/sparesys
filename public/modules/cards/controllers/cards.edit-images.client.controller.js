'use strict';

angular.module('cards').controller('EditCardImagesController', ['$scope', '$modal',
    function ($scope, $modal) {


        $scope.hasMode = false;

        $scope.init = function() {
            $scope.hasMode = $scope.card.modes && $scope.card.modes.indexOf('images') !== -1;
        };


        $scope.manageImages = function (card) {

            if (!card.hasImagesMode) {
                return;
            }

            $scope.card = card;

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
            } else {
                for (var i in $scope.card.modes) {
                    if ($scope.card.modes[i] === mode) {
                        $scope.card.modes.splice(i, 1);
                    }
                }
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

            $scope.card.$update(function() {
                $scope.hasMode =  $scope.card.modes.indexOf('images') > -1;
            });

        };



    }
]);
