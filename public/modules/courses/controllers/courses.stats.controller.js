'use strict';


// Courses controller
angular.module('courses').controller('StatsController',
    ['$scope', '$stateParams', '$location', '$modal', 'Authentication', 'Courses', 'CoursesService',
        function ($scope, $stateParams, $location, $modal, Authentication, Courses, CoursesService) {


            console.log('here');
            console.log(google);


            $scope.authentication = Authentication;
            // Find existing Course
            $scope.findOne = function () {
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
            };


            $scope.drawChart = function () {
                console.log('trying');

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


            };

            google.setOnLoadCallback($scope.drawChart);
        }
    ]);