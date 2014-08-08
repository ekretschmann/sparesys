'use strict';


// Courses controller
angular.module('courses').controller('UploadController',
    ['$scope', '$stateParams', '$state', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards',
        function ($scope, $stateParams, $state, $location, $modal, Authentication, Courses, Packs, Cards) {
            $scope.authentication = Authentication;


            $scope.text = '';

            $scope.upload = function() {
                console.log($scope.coursename);
                console.log($scope.text);
//
                var lines = $scope.text.split("\n");


                var course = new Courses({
                    name: $scope.courseName,
                    description: $scope.description
                });

                // Redirect after save
                course.$save(function (c) {

                    for (var i = 0; i < lines.length; i+=40) {

                        var pack = new Packs({
                            name: 'Pack '+i/40,
                            course: c._id
                        });

                        pack.$save(function (p) {


                        });
                        console.log('  create pack: Pack '+i/40);

                        for (var j = 0; j < 40; j+=2) {
                            if (i+j+1 < lines.length) {
                                var answer = lines[i + j];
                                var question = lines[i + j + 1];
                                console.log('    card: '+question+': '+answer);
                            }
                        }
                    }

                    //$location.path('courses/' + response._id + '/edit');
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

//                console.log('crate course');
//


//                var course = new Courses({
//                    name: $scope.coursename,
//                    description: $scope.description
//                });
//
//                // Redirect after save
//                course.$save(function (response) {
//                    $location.path('courses/' + response._id + '/edit');
//                }, function (errorResponse) {
//                    $scope.error = errorResponse.data.message;
//                });

            };


        }
    ]);