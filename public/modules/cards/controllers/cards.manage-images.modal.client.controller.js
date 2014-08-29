'use strict';

angular.module('packs').controller('ManageImagesController', ['$scope', '$http', '$state', '$location', '$modalInstance', 'card', 'CoursesService',
    function ($scope, $http, $state, $location, $modalInstance, card, CoursesService) {
        $scope.card = card;



        $scope.images = [];
        $scope.search = {};
        $scope.search.text = $scope.card.question;;



//        $http({ method: 'GET',
//            url: 'https://connect.gettyimages.com:443/v3/search/images?phrase=453539050',
//            headers: {'Api-Key': 'kxp5cbugd37388ra47sww5fr'}}).
//            success(function (data, status, headers, config) {
//                console.log(data);
//                data.images.forEach(function(image) {
//                    console.log(image.id)
//                });
//            }).
//            error(function (data, status, headers, config) {
//                console.log(data);
//                console.log();
//                console.log(status);
//                console.log();
//                console.log(headers);
//                console.log();
//                console.log(config);
//            });

        $scope.search = function () {

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



            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);