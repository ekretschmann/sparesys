'use strict';


/* global d3 */
angular.module('courses').controller('CourseReportController', ['$scope', '$stateParams','$window', 'CoursesService', 'DiagramsCalendarService',
    'DiagramsCardsInPlayService', 'DiagramsTimeSpentService', 'DiagramsTimeSeriesService','Courses',
    function ($scope, $stateParams, $window, CoursesService, DiagramsCalendarService, DiagramsCardsInPlayService, DiagramsTimeSpentService, DiagramsTimeSeriesService, Courses) {



        $scope.init = function () {


            $scope.course = Courses.get({
                courseId: $stateParams.courseId
            }, function () {





                var res = CoursesService.serverLoadCards();
                var promise = res.get({courseId: $stateParams.courseId});
                promise.$promise.then(function (cards) {

                    $scope.cards = cards;
                    DiagramsCalendarService.drawCalendar(cards, '#cal', '#practice-date', '#number-of-cards', ($window.innerWidth / 2)-130);

                    var w = $window.innerWidth + 110;
                    //if ($window.innerWidth > 990){
                    //    w = ($window.innerWidth) + 60;
                    //}
                    DiagramsCardsInPlayService.drawLineChart(cards, '#inplay', '#total-cards-learned', w);
                    DiagramsTimeSpentService.drawBarChart(cards, '#timespent', '#spent-practice-date', '#spent-practice-time','#spent-all-time', w);
                });
            });


        };


        $scope.diagramShown = false;
        $scope.initProgress = function (id, index) {

            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: id});
            promise.$promise.then(function (cards) {

                var repetitions = 0;
                for (var i=0; i<cards.length; i++) {
                    repetitions+=cards[i].history.length;
                }


                if (repetitions < 3) {
                    $scope.diagramShown = false;
                } else {
                    $scope.diagramShown = true;
                }
                var w = $window.innerWidth + 110;
                //if ($window.innerWidth > 990){
                //    w = ($window.innerWidth) + 60;
                //}
                DiagramsCardsInPlayService.drawLineChart(cards, '#inplay'+index, undefined, w);
                //DiagramsTimeSpentService.drawBarChart(cards, '#timespent'+index, '#spent-practice-date'+index, '#spent-practice-time'+index, ($window.innerWidth / 2)-130);
            });
        };

        $scope.score = 0;


        $scope.selectedCards = [];
        $scope.initTimeSeries = function (item, model, label) {
            //console.log(item);
            //console.log(model);
            //console.log(label);

            var w = $window.innerWidth + 110;
            //if ($window.innerWidth > 990){
            //    w = ($window.innerWidth / 2) + 60;
            //}
            DiagramsTimeSeriesService.drawTimeSeries($scope.selectedCards, '#timeseries', w);
        };



    }
]);
