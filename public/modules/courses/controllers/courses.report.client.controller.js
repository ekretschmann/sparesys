'use strict';


/* global d3 */
angular.module('courses').controller('CourseReportController', ['$scope', 'CoursesService', 'DiagramsService',
    function ($scope, CoursesService, DiagramsService) {

        $scope.init = function (id) {
            var res = CoursesService.serverLoadCards();
            var promise = res.get({courseId: id});
            promise.$promise.then(function (cards) {
                console.log('aaaaaa');
                DiagramsService.drawCalendar(cards);
            });



        };



    }
]);
