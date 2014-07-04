'use strict';


// Courses controller
angular.module('core').controller('PracticeController',
    ['$scope', '$q', '$stateParams', '$http', '$state', '$location', '$modal', '$timeout', '$document', 'Authentication', 'Courses', 'Packs', 'Cards', 'PredictiveSchedulerService', 'CoursesService', 'ForgettingIndexCalculatorService',
        function ($scope, $q, $stateParams, $http, $state, $location, $modal, $timeout, $document, Authentication, Courses, Packs, Cards, SchedulerService, CoursesService, ForgettingIndexCalculator) {
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
                ForgettingIndexCalculator.record($scope.card, Date.now(), rating);
                $scope.card = SchedulerService.nextCard();
                $state.go($state.current);

//                $scope.card.history.push([Date.now, rating]);
//                console.log($scope.card);

            };


            $scope.loadSound = function (answer) {
//                console.log('loading sound ' + answer);

//                $http({method: 'GET',
//                    url: 'http://translate.google.com/translate_tts?tl=en&q=the%20brown%20fox.',
//                    headers: {'User-Agent': 'Mozilla'}}).
//                    success(function (data, status, headers, config) {
//                        console.log('success');
//                        console.log(data);
//                        console.log(status);
//                        console.log(headers);
//                        console.log(config);
//
//                        // this callback will be called asynchronously
//                        // when the response is available
//                    }).
//                    error(function (data, status, headers, config) {
//                        console.log('failed');
//                        console.log(data);
//                        console.log(status);
//                        console.log(headers);
//                        console.log(config);
//                    });


            };

            // Find existing Course
            $scope.init = function () {
                var res = CoursesService.serverLoadCards();
                res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                    $scope.cards = cards;
                    SchedulerService.init($scope.cards);
                    $scope.card = SchedulerService.nextCard();
                });

                Courses.get({
                    courseId: $stateParams.courseId
                }, function (course) {
                    $scope.course = course;
                });
            };
        }
    ])
;