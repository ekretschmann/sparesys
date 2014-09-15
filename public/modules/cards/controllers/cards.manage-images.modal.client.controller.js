'use strict';

angular.module('packs').controller('ManageImagesController', ['$scope', '$http', '$state', '$timeout', '$location', '$modalInstance', 'card', 'CoursesService',
    function ($scope, $http, $state, $timeout, $location, $modalInstance, card, CoursesService) {
        $scope.card = card;



        $scope.images = [];
        $scope.search = {};
        $scope.search.text = $scope.card.question;

        $scope.setFocus = function () {
            console.log('setting focus');
            $timeout(function () {
                angular.element('.focus').trigger('focus');
            }, 100);
        };


        // init selected image array
        if (!card.images) {
            card.images = [];
        }

        $scope.selected = {};
        $scope.selected.images = [];
        card.images.forEach(function(img) {
            $scope.selected.images.push(img);
        });
        for (var i = card.images.length; i < 4; i++) {
            $scope.selected.images.push('/modules/core/img/brand/placeholder_icon.png');
        }


        $scope.addImage = function(image) {
            $scope.card.images.push(image);
            $scope.selected.images = [];
            $scope.card.images.forEach(function(img) {
                $scope.selected.images.push(img);
            });
            console.log($scope.selected.images);
            for (var i = $scope.card.images.length; i < 4; i++) {
                $scope.selected.images.push('/modules/core/img/brand/placeholder_icon.png');
            }
            console.log($scope.selected.images);
        };

        $scope.removeImage = function(image) {

            console.log(image);
            for (var i in $scope.card.images) {
                if ($scope.card.images[i] === image) {
                    $scope.card.images.splice(i, 1);
                }
            }

            $scope.selected.images = [];
            $scope.card.images.forEach(function(img) {
                $scope.selected.images.push(img);
            });
            console.log($scope.selected.images);
            for (i = $scope.card.images.length; i < 4; i++) {
                $scope.selected.images.push('/modules/core/img/brand/placeholder_icon.png');
            }
            console.log($scope.selected.images);
        };

        $scope.search = function () {

            $scope.images = [['/modules/core/img/brand/philosopher-medium.gif','/modules/core/img/brand/teacher-man-medium.gif','/modules/core/img/brand/philosopher-medium.gif'],
                ['/modules/core/img/brand/teacher-woman-medium.gif','/modules/core/img/brand/superhero-boy-medium.gif','/modules/core/img/brand/teacher-woman-medium.gif'],
                ['/modules/core/img/brand/guru-medium.gif','/modules/core/img/brand/superhero-girl-medium.gif','/modules/core/img/brand/superhero-girl-medium.gif']];
        };

        $scope.search_online = function () {

            console.log('https://connect.gettyimages.com:443/v3/search/images/creative?phrase='+$scope.search.text);

            $http({ method: 'GET',
                url: 'https://connect.gettyimages.com:443/v3/search/images/creative?phrase='+$scope.search.text,
                headers: {'Api-Key': 'kxp5cbugd37388ra47sww5fr'}}).
                success(function (data, status, headers, config) {
                    var max = 9;
                    var counter = 0;
                    $scope.images = [];
                    var row = [];

                    data.images.forEach(function(image) {

                        if (counter < max) {

                            if (counter % 3 === 0) {
                                row = [];
                                $scope.images.push(row);
                            }
                            row.push(image.display_sizes[0].uri);
                        }
                        counter++;

                    });

                    console.log($scope.images);
                }).
                error(function (data, status, headers, config) {
                    console.log(data);
                    console.log();
                    console.log(status);
                    console.log();
                    console.log(headers);
                    console.log();
                    console.log(config);
                });
        };

        $scope.ok = function () {


            $scope.card.$update(function() {
                $state.go($state.$current, null, { reload: true });
            });

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);