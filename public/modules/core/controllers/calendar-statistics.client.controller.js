'use strict';


/* global d3 */
angular.module('core').controller('CalendarStatisticsController', ['$window', '$scope', 'Authentication',
    function ($window, $scope, Authentication) {
        $scope.authentication = Authentication;


        $scope.width = 720;
        $scope.height = 100;
        $scope.cellSize = 12;

        $scope.day = d3.time.format('%w');
        $scope.week = d3.time.format('%U');
        $scope.percent = d3.format('.1%');
        $scope.format = d3.time.format('%Y-%m-%d');


        $scope.init = function () {


            var color = d3.scale.quantize()
                .domain([-0.05, 0.05])
                .range(d3.range(11).map(function (d) {
                    return 'q' + d + '-11';
                }));

            var svg = d3.select('#cal').selectAll('svg')
                .data(d3.range(2008, 2011))
                .enter().append('svg')
                .attr('width', '100%')
                //.attr('height', $scope.height)
                .attr('class', 'RdYlGn')
                .append('g')
                .attr('transform', 'translate(' + (($scope.width - $scope.cellSize * 53) / 2) + ',' + ($scope.height - $scope.cellSize * 7 - 1) + ')');

            svg.append('text')
                .attr('transform', 'translate(-6,' + $scope.cellSize * 3.5 + ')rotate(-90)')
                .style('text-anchor', 'middle')
                .text(function (d) {
                    return d;
                });

            var rect = svg.selectAll('.day')
                .data(function (d) {
                    return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
                })
                .enter().append('rect')
                .attr('class', 'day')
                .attr('width', $scope.cellSize)
                .attr('height', $scope.cellSize)
                .attr('x', function (d) {
                    return $scope.week(d) * $scope.cellSize;
                })
                .attr('y', function (d) {
                    return $scope.day(d) * $scope.cellSize;
                })
                .datum($scope.format);

            rect.append('title')
                .text(function (d) {
                    return d;
                });

            svg.selectAll('.month')
                .data(function (d) {
                    return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
                })
                .enter().append('path')
                .attr('class', 'month')
                .attr('d', $scope.monthPath);

            var data = [];
            data['2010-10-01'] = 0.037035252073270622;
            data['2010-09-30'] = -0.044213895215559915;
            data['2010-09-29'] = -0.02090628275240782;
            data['2010-09-28'] = 0.04467222024357327;
            data['2010-09-27'] = -0.004418956485387221;

            rect.filter(function (d) {
                return d in data;
            })
                .attr('class', function (d) {
                    return 'day ' + color(data[d]);
                })
                .select('title')
                .text(function (d) {
                    return d + ': ' + $scope.percent(data[d]);
                });


        };


        $scope.monthPath = function(t0) {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                d0 = +$scope.day(t0), w0 = +$scope.week(t0),
                d1 = +$scope.day(t1), w1 = +$scope.week(t1);
            return 'M' + (w0 + 1) * $scope.cellSize + ',' + d0 * $scope.cellSize +
                'H' + w0 * $scope.cellSize + 'V' + 7 * $scope.cellSize +
                'H' + w1 * $scope.cellSize + 'V' + (d1 + 1) * $scope.cellSize +
                'H' + (w1 + 1) * $scope.cellSize + 'V' + 0 +
                'H' + (w0 + 1) * $scope.cellSize + 'Z';
        };


    }]);
