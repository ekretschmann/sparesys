'use strict';


// Courses controller
angular.module('core').controller('PracticeController',
    ['$scope', '$stateParams', '$location', '$modal', '$timeout','Authentication', 'Courses', 'Packs', 'Cards',
        function ($scope, $stateParams, $location, $modal, $timeout, Authentication, Courses, Packs, Cards) {
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
                                   $scope.cards.push(card);
                               });
                            });
                            console.log('done')
                            console.log($scope.cards)

                        });
                    });
                });
            };

            $scope.nextCard = function() {
//                while(!cardsLoaded) {
//                    $timeout(function(){
////                    angular.element('.addpackfocus').trigger('focus');
//
//                    },1000);
//                }

                console.log($scope.cards);
            };
        }
    ]);