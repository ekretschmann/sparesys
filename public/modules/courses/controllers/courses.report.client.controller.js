'use strict';


/* global d3 */
angular.module('courses').controller('CourseReportController', ['$scope', '$window', 'CoursesService', 'DiagramsCalendarService', 'DiagramsCardsInPlayService',
    function ($scope, $window, CoursesService, DiagramsCalendarService, DiagramsCardsInPlayService) {

        $scope.init = function (id, index) {

            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: id});
            promise.$promise.then(function (cards) {
                DiagramsCalendarService.drawCalendar(cards, '#cal'+index, '#practice-date'+index, '#number-of-cards'+index, ($window.innerWidth / 2)-100);
                DiagramsCardsInPlayService.drawLineChart(cards, '#inplay'+index, $window.innerWidth);
            });
        };

        $scope.score = 0;





    }
]);
