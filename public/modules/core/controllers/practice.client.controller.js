'use strict';


// Courses controller
angular.module('core').controller('PracticeController',
    ['$scope', '$q', '$stateParams', '$state', '$location', '$modal', '$timeout', '$document', 'Authentication', 'Courses', 'Packs', 'Cards', 'RoundRobinSchedulerService', 'CoursesService',
        function ($scope, $q, $stateParams, $state, $location, $modal, $timeout, $document, Authentication, Courses, Packs, Cards, SchedulerService, CoursesService) {
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
                $scope.card = SchedulerService.nextCard();
                $state.go($state.current);
            };


            // Find existing Course
            $scope.init = function () {
                var res = CoursesService.serverLoadCards();
                res.get({courseId: $stateParams.courseId}).$promise.then(function(cards) {
                    $scope.cards = cards;
                    SchedulerService.init($scope.cards);
                    $scope.card = SchedulerService.nextCard();
                });

                Courses.get({
                    courseId: $stateParams.courseId
                }, function(course) {
                    $scope.course = course;
                });
            };
        }
    ])
;