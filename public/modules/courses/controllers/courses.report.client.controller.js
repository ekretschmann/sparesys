'use strict';


/* global d3 */
angular.module('courses').controller('CourseReportController', ['$scope', '$stateParams','$window', 'CoursesService', 'DiagramsCalendarService',
    'DiagramsCardsInPlayService', 'DiagramsTimeSpentService', 'Courses',
    function ($scope, $stateParams, $window, CoursesService, DiagramsCalendarService, DiagramsCardsInPlayService, DiagramsTimeSpentService, Courses) {

        $scope.init = function () {


            $scope.course = Courses.get({
                courseId: $stateParams.courseId
            }, function () {




                var res = CoursesService.serverLoadCards();
                var promise = res.get({courseId: $stateParams.courseId});
                promise.$promise.then(function (cards) {
                    DiagramsCalendarService.drawCalendar(cards, '#cal', '#practice-date', '#number-of-cards', ($window.innerWidth / 2)-130);

                    var w = $window.innerWidth + 110;
                    if ($window.innerWidth > 990){
                        w = ($window.innerWidth / 2) + 60;
                    }
                    DiagramsCardsInPlayService.drawLineChart(cards, '#inplay', w);
                    DiagramsTimeSpentService.drawBarChart(cards, '#timespent', '#spent-practice-date', '#spent-practice-time','#spent-all-time', ($window.innerWidth / 2)-130);
                });
            });


        };


        $scope.initProgress = function (id, index) {

            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: id});
            promise.$promise.then(function (cards) {
                //DiagramsCalendarService.drawCalendar(cards, '#cal'+index, '#practice-date'+index, '#number-of-cards'+index, ($window.innerWidth / 2)-130);

                var w = $window.innerWidth + 110;
                if ($window.innerWidth > 990){
                    w = ($window.innerWidth / 2) + 60;
                }
                DiagramsCardsInPlayService.drawLineChart(cards, '#inplay'+index, w);
                //DiagramsTimeSpentService.drawBarChart(cards, '#timespent'+index, '#spent-practice-date'+index, '#spent-practice-time'+index, ($window.innerWidth / 2)-130);
            });
        };

        $scope.score = 0;





    }
]);
