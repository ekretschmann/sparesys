'use strict';


/* global d3 */
angular.module('courses').controller('CourseReportController', ['$scope', '$window', 'CoursesService', 'DiagramsCalendarService',
    'DiagramsCardsInPlayService', 'DiagramsTimeSpentService',
    function ($scope, $window, CoursesService, DiagramsCalendarService, DiagramsCardsInPlayService, DiagramsTimeSpentService) {

        $scope.init = function (id, index) {

            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: id});
            promise.$promise.then(function (cards) {
                //DiagramsCalendarService.drawCalendar(cards, '#cal'+index, '#practice-date'+index, '#number-of-cards'+index, ($window.innerWidth / 2)-130);
                DiagramsCardsInPlayService.drawLineChart(cards, '#inplay'+index, ($window.innerWidth / 2)+60);
                //DiagramsTimeSpentService.drawBarChart(cards, '#timespent'+index, '#spent-practice-date'+index, '#spent-practice-time'+index, ($window.innerWidth / 2)-130);
            });
        };

        $scope.score = 0;





    }
]);
