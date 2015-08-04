'use strict';


/* global d3 */
angular.module('courses').controller('CourseReportController', ['$scope', 'CoursesService', 'DiagramsCalendarService',
    function ($scope, CoursesService, DiagramsCalendarService) {

        $scope.init = function (id, index) {
            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: id});
            promise.$promise.then(function (cards) {
                DiagramsCalendarService.drawCalendar(cards, '#cal'+index, '#practice-date'+index, '#number-of-cards'+index);
                //DiagramsService.drawLineChart(cards, '#inplay'+index);
            });
        };

        $scope.score = 0;





    }
]);
