'use strict';


// Courses controller
angular.module('schoolclasses').controller('CourseProgressController',
    ['$scope', '$stateParams', 'Courses', 'CoursesService', 'Schoolclasses',
        function ($scope, $stateParams, Courses, CoursesService, Schoolclasses) {


            //$scope.authentication = Authentication;
            // Find existing Course
            $scope.findData = function () {
                console.log($stateParams);
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
                $scope.schoolclass = Schoolclasses.get({
                    schoolclassId: $stateParams.schoolclassId
                });

            };


            $scope.drawCharts = function () {
                $scope.drawCalendarChart();
//                $scope.drawScoreChart();
            };

            $scope.drawScoreChart = function () {


                //var dataTable = new google.visualization.DataTable();
                //dataTable.addColumn({ type: 'date', id: 'Date' });
                //dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
                //dataTable.addRows([
                //    [ new Date(2015, 5, 4), 38177 ],
                //    [ new Date(2015, 5, 5), 38705 ],
                //    [ new Date(2015, 5, 12), 38210 ],
                //    [ new Date(2015, 5, 13), 38029 ],
                //    [ new Date(2015, 5, 19), 38823 ],
                //    [ new Date(2015, 5, 23), 38345 ],
                //    [ new Date(2015, 5, 24), 38436 ],
                //    [ new Date(2015, 5, 30), 38447 ]
                //]);
                //
                //var chart = new google.visualization.Calendar(document.getElementById('chart_div'));
                //
                //var options = {
                //    title: 'Red Sox Attendance',
                //    height: 350
                //};
                //
                //chart.draw(dataTable, options);

                //var res = CoursesService.serverLoadCards();
                //res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                //    $scope.cards = cards;
                //
                //    //SchedulerService.init(cards);
                //    //
                //    //console.log('starts');
                //    //console.log(SchedulerService.getCourseStart());
                //    //console.log('score');
                //    //console.log(SchedulerService.getPredictedCourseRetention(Date.now()) * 100);
                //
                //
                //
                //
                //    /* jshint ignore:start */
                //    var data = google.visualization.arrayToDataTable([
                //        ['Year', 'Sales', 'Expenses'],
                //        ['2004', 1000, 400],
                //        ['2005', 1170, 460],
                //        ['2006', 660, 1120],
                //        ['2007', 1030, 540]
                //    ]);
                //
                //    var options = {
                //        title: 'Company Performance'
                //    };
                //
                //    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
                //
                //    chart.draw(data, options);
                //    /* jshint ignore:end */
                //
                //});
            };

            $scope.drawCalendarChart = function () {

                var res = CoursesService.serverLoadCards();
                res.get({courseId: $stateParams.courseId}).$promise.then(function (cards) {
                    $scope.cards = cards;

                    /* jshint ignore:start */
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
                    /* jshint ignore:end */
                });


            };

            /* jshint ignore:start */
            if (google) {
                google.setOnLoadCallback($scope.drawCharts);
            }
            /* jshint ignore:end */
        }
    ]);
