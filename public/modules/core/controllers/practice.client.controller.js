'use strict';


// Courses controller
angular.module('core').controller('PracticeController',
    ['$scope', '$q', '$stateParams', '$state', '$location', '$modal', '$timeout', '$document', 'Authentication', 'Courses', 'Packs', 'Cards',
        function ($scope, $q, $stateParams, $state, $location, $modal, $timeout, $document, Authentication, Courses, Packs, Cards) {
            $scope.authentication = Authentication;


            $scope.showAnswer = false;
            $scope.cards = [];
            $scope.card = undefined;

            $document.bind('keypress', function (event) {
                if (event.keyCode === 13) {
                    $scope.toggleAnswer();
                }
            });


            $scope.loadCards = function (callback) {
                var deferred = $q.defer();
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                }, function (course) {
                    course.packs.forEach(function (packId) {
                        var packs = Packs.get({
                            packId: packId
                        }, function (pack) {
                            pack.cards.forEach(function (cardId) {
                                Cards.get({
                                    cardId: cardId
                                }, function (card) {
                                    $scope.cards.push(card);
                                    deferred.resolve();
                                });
                            });

                        });
                    });
                });

                return deferred.promise;
            };
            // Find existing Course
            $scope.init = function () {
                $scope.loadCards().then(function () {

                    $scope.card = $scope.cards[0];
                    $state.go($state.current);
                });


            };


            $scope.index = 0;
            $scope.nextCard = function () {
                $scope.index = $scope.index + 1;
                if ($scope.cards.length <= $scope.index) {
                    $scope.index = 0;
                }

                return $scope.cards[$scope.index];

            };

            $scope.toggleAnswer = function () {

                if ($scope.showAnswer) {
                    $scope.card = $scope.nextCard();
                }
                $scope.showAnswer = !$scope.showAnswer;
                $state.go($state.current);
            };


        }
    ])
;