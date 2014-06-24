'use strict';


// Courses controller
angular.module('core').controller('PracticeController',
    ['$scope', '$q', '$stateParams', '$state', '$location', '$modal', '$timeout', '$document', 'Authentication', 'Courses', 'Packs', 'Cards',
        function ($scope, $q, $stateParams, $state, $location, $modal, $timeout, $document, Authentication, Courses, Packs, Cards) {
            $scope.authentication = Authentication;


            $scope.state = 'question';
            $scope.cards = [];
            $scope.card = undefined;

            $document.bind('keypress', function (event) {
                if ($scope.state === 'question' && event.key === 'Enter') {
                    $scope.showAnswer();
                } else if ($scope.state === 'answer') {
                    if (event.key === '1') {
                        $scope.rateCard(1);
                    }
                    if (event.key === '2') {
                        $scope.rateCard(2);
                    }
                    if (event.key === '3') {
                        $scope.rateCard(3);
                    }
                    if (event.key === '0') {
                        $scope.rateCard(0);
                    }
                }

            });


            $scope.showAnswer = function () {
                $scope.state = 'answer';
                $state.go($state.current);
            };

            $scope.rateCard = function (rating) {
                $scope.state = 'question';
                $scope.card = $scope.dealer.nextCard();
                $state.go($state.current);
            };

            $scope.loadCards = function () {
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


            var nextCard = function () {
                this.index = this.index + 1;
                if (this.cards.length <= this.index) {
                    this.index = 0;
                }

                return this.cards[this.index];
            };

            function Dealer(cards) {
                this.cards = cards;
                this.index = 0;
                this.nextCard = nextCard;
            }

            // Find existing Course
            $scope.init = function () {
                $scope.loadCards().then(function () {
                     $scope.dealer = new Dealer($scope.cards);

                    $scope.card = $scope.dealer.nextCard();
                    $scope.state = 'question';
                    $state.go($state.current);
                });
            };
        }
    ])
;