'use strict';


/* global d3 */
angular.module('courses').controller('CourseReportController', ['$scope', 'CoursesService', 'DiagramsService',
    function ($scope, CoursesService, DiagramsService) {

        $scope.init = function (id, index) {
            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: id});
            promise.$promise.then(function (cards) {
                DiagramsService.drawCalendar(cards, '#cal'+index);
            });
        };

        $scope.score = 0;





    }
]);
