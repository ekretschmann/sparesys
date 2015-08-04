'use strict';


/* global d3 */
angular.module('courses').controller('CourseReportController', ['$scope', 'CoursesService', 'DiagramsCalendarService', 'DiagramsCardsInPlayService',
    function ($scope, CoursesService, DiagramsCalendarService, DiagramsCardsInPlayService) {

        $scope.init = function (id, index) {
            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: id});
            promise.$promise.then(function (cards) {
                DiagramsCalendarService.drawCalendar(cards, '#cal'+index, '#practice-date'+index, '#number-of-cards'+index);
                DiagramsCardsInPlayService.drawLineChart(cards, '#inplay'+index);
            });
        };

        $scope.score = 0;





    }
]);
