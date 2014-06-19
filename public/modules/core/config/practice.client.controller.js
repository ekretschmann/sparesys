'use strict';


// Courses controller
angular.module('core').controller('PracticeController',
    ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'Packs', 'Cards',
        function ($scope, $stateParams, $location, $modal, Authentication, Courses, Packs, Cards) {
            $scope.authentication = Authentication;


            var cardsLoaded = false;
            $scope.cards = [];

            // Find existing Course
            $scope.findOne = function () {

                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                }, function(course) {
                    course.packs.forEach(function(packId) {
                        var packs = Packs.get({
                            packId: packId
                        }, function(pack) {
                            pack.cards.forEach(function(cardId) {
                               Cards.get({
                                   cardId: cardId
                               }, function(card) {
//                                   console.log(card);
                                   $scope.cards.push(card);
                                   cardsLoaded = true;
                               });
                            });

                        });
                    });
                });
            };

            $scope.nextCard = function() {
//                while(!cardsLoaded) {
//
//                }
                console.log($scope.cards);
            };
        }
    ]);