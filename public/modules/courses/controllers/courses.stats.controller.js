'use strict';


// Courses controller
angular.module('courses').controller('StatsController',
    ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'CoursesService',
        function ($scope, $stateParams, $location, $modal, Authentication, Courses, CoursesService) {


            $scope.authentication = Authentication;
            // Find existing Course
            $scope.findOne = function () {
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
            };

//            // Load the Visualization API and the piechart package.
//            google.load('visualization', '1.0', {'packages':['corechart']});
//
//            // Set a callback to run when the Google Visualization API is loaded.


//            $scope.drawChart = function() {
//
//                // Create the data table.
//                var data = new google.visualization.DataTable();
//                data.addColumn('string', 'Topping');
//                data.addColumn('number', 'Slices');
//                data.addRows([
//                    ['Mushrooms', 3],
//                    ['Onions', 1],
//                    ['Olives', 1],
//                    ['Zucchini', 1],
//                    ['Pepperoni', 2]
//                ]);
//
//                // Set chart options
//                var options = {'title':'How Much Pizza I Ate Last Night',
//                    'width':400,
//                    'height':300};
//
//                // Instantiate and draw our chart, passing in some options.
//                var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
//                chart.draw(data, options);
//            };

            $scope.drawChart = function () {
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
//                            console.log(d.getFullYear());
//                            console.log(d.getMonth());
//                            console.log(d.getDate());
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

                    console.log(dates);
                    dataTable.addRows(dates);
                    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

                    var options = {
                        title: 'Questions Answered',
                        calendar: { cellSize: 12 }
                    };

                    chart.draw(dataTable, options);
                });

//
//
//                dataTable.addRows([
//                    [ new Date(2012, 3, 13), 37032 ],
//                    [ new Date(2012, 3, 14), 38024 ],
//                    [ new Date(2012, 3, 15), 38024 ],
//                    [ new Date(2012, 3, 16), 38108 ],
//                    [ new Date(2012, 3, 17), 38229 ],
//                    // Many rows omitted for brevity.
//                    [ new Date(2013, 9, 4), 38177 ],
//                    [ new Date(2013, 9, 5), 38705 ],
//                    [ new Date(2013, 9, 12), 38210 ],
//                    [ new Date(2013, 9, 13), 38029 ],
//                    [ new Date(2013, 9, 19), 38823 ],
//                    [ new Date(2013, 9, 23), 38345 ],
//                    [ new Date(2013, 9, 24), 38436 ],
//                    [ new Date(2013, 9, 30), 38447 ]
//                ]);


            };

            google.setOnLoadCallback($scope.drawChart);
        }
    ]);