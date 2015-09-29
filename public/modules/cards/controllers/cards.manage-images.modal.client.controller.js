'use strict';

angular.module('packs').controller('ManageImagesController', ['$scope', '$http', '$state', '$timeout', '$location', '$modalInstance', 'card', 'CoursesService',
    function ($scope, $http, $state, $timeout, $location, $modalInstance, card, CoursesService) {
        $scope.card = card;




        $scope.images = [];
        $scope.search = {};


        $scope.setFocus = function () {
            $scope.search.text = $scope.card.question;
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
            for (var i = $scope.card.images.length; i < 4; i++) {
                $scope.selected.images.push('/modules/core/img/brand/placeholder_icon.png');
            }

            var modeToggle = $scope.card.hasImagesMode;
            $scope.card.$update(function() {
                $scope.card.hasImagesMode = modeToggle;
            });
        };

        $scope.removeImage = function(image) {

            for (var i in $scope.card.images) {
                if ($scope.card.images[i] === image) {
                    $scope.card.images.splice(i, 1);
                }
            }

            $scope.selected.images = [];
            $scope.card.images.forEach(function(img) {
                $scope.selected.images.push(img);
            });
            for (i = $scope.card.images.length; i < 4; i++) {
                $scope.selected.images.push('/modules/core/img/brand/placeholder_icon.png');
            }



            var modeToggle = $scope.card.hasImagesMode;
            $scope.card.$update(function() {
                $scope.card.hasImagesMode = modeToggle;
            });
        };


        $scope.page = 0;
        $scope.totalResults = 0;
        //$scope.online = false;
        //
        //
        //$scope.$watch('online', function(newStatus) {
        //
        //    $scope.online = newStatus;
        //
        //});


        $scope.search_offline = function () {


            $scope.totalResults = 50;
            $scope.images = [['/modules/core/img/brand/philosopher-medium.gif','/modules/core/img/brand/teacher-man-medium.gif','/modules/core/img/one.jpeg'],
                ['/modules/core/img/brand/teacher-woman-medium.gif','/modules/core/img/brand/superhero-boy-medium.gif','/modules/core/img/two.png'],
                ['/modules/core/img/brand/guru-medium.gif','/modules/core/img/brand/superhero-girl-medium.gif','/modules/core/img/three.gif' ]];
        };

        $scope.testImages=[
            '/modules/core/img/brand/philosopher-medium.gif',
            '/modules/core/img/brand/teacher-man-medium.gif',
            '/modules/core/img/brand/teacher-woman-medium.gif',
            '/modules/core/img/brand/superhero-boy-medium.gif',
            '/modules/core/img/brand/superhero-girl-medium.gif',
            '/modules/core/img/brand/guru-medium.gif'
        ];

        $scope.nextPage = function() {
            var data = {};
            data.images = [];
            var row = [];
            var counter = 0;
            var max = 9;
            $scope.images = [];
            for(var i=0; i<9; i++) {
                var img = $scope.testImages[Math.floor((Math.random()*$scope.testImages.length))];
                data.images.push(img);
            }
            data.images.forEach(function(image) {

                if (counter < max) {

                    if (counter % 3 === 0) {
                        row = [];
                        $scope.images.push(row);
                    }
                    row.push(image);
                }
                counter++;
            });
        };

        $scope.page = 1;
        $scope.max_page = 1;

        $scope.next = function() {
            if ($scope.page < $scope.max_page) {
                $scope.page++;
                $scope.search();
            }
        };

        $scope.prev = function() {

            if ($scope.page>1) {
                $scope.page--;
                $scope.search();
            }
        };

        $scope.newSearch = function () {
            $scope.page = 1;
            $scope.search();
        };

        $scope.search = function () {
            //
            //if (!$scope.online) {
            //    $scope.search_offline();
            //    return;
            //}


            $http({ method: 'GET',
                url: 'https://connect.gettyimages.com:443/v3/search/images/creative?phrase='+$scope.search.text+'&page_size=9&page='+$scope.page,
                headers: {'Api-Key': 'kxp5cbugd37388ra47sww5fr'}}).
                success(function (data, status, headers, config) {


                    $scope.max_page = Math.floor(data.result_count / 9);


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



            //var modeToggle = $scope.hasImagesMode;
            $scope.card.$update(function() {
                //$scope.hasImagesMode = modeToggle;
                $state.go($state.$current, null, { reload: true });
            });

            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }
]);