'use strict';


// Courses controller
angular.module('courses').controller('StatsController',
    ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'CoursesService', 'PredictiveSchedulerService',
        function ($scope, $stateParams, $location, $modal, Authentication, Courses, CoursesService, SchedulerService) {


            $scope.authentication = Authentication;
            // Find existing Course
            $scope.findOne = function () {
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
            };


            $scope.drawCharts = function () {
                $scope.drawCalendarChart();
//                $scope.drawScoreChart();
            };

            $scope.drawScoreChart = function () {

                var res = CoursesService.serverLoadCards();
                res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                    $scope.cards = cards;

                    SchedulerService.init(cards);

                    console.log('starts');
                    console.log(SchedulerService.getCourseStart());
                    console.log('score');
                    console.log(SchedulerService.getPredictedCourseRetention(Date.now()) * 100);




                    var data = google.visualization.arrayToDataTable([
                        ['Year', 'Sales', 'Expenses'],
                        ['2004', 1000, 400],
                        ['2005', 1170, 460],
                        ['2006', 660, 1120],
                        ['2007', 1030, 540]
                    ]);

                    var options = {
                        title: 'Company Performance'
                    };

                    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

                    chart.draw(data, options);
                });
            };

            $scope.drawCalendarChart = function () {

                var res = CoursesService.serverLoadCards();
                res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                    $scope.cards = cards;

                    var dataTable = new google.visualization.DataTable();
                    dataTable.addColumn({ type: 'date', id: 'Date' });
                    dataTable.addColumn({ type: 'number', id: 'Won/Loss' });

                    var dates = [];
                    var data = {};
                    for (var i = 0; i < $scope.cards.length; i++) {
                        var c = $scope.cards[i];
                        for (var j = 0; j < c.history.length; j++) {
                            var h = c.history[j];
                            var d = new Date(h.when);
                            var day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                            if (data[day]) {
                                data[day]++;
                            } else {
                                data[day] = 1;
                            }
                        }
                    }

                    var keys = Object.keys(data);
                    for (i = 0; i < keys.length; i++) {

                        dates.push([new Date(Date.parse(keys[i])), data[keys[i]]]);
                    }

                    dataTable.addRows(dates);
                    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

                    var options = {
                        title: 'Questions Answered',
                        calendar: { cellSize: 12 }
                    };

                    chart.draw(dataTable, options);
                });


            };

            google.setOnLoadCallback($scope.drawCharts);
        }
    ]);