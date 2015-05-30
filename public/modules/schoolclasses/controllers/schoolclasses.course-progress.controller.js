'use strict';


/* global d3 */
angular.module('schoolclasses').controller('CourseProgressController',
    ['$scope', '$stateParams', 'Courses', 'CoursesService', 'Schoolclasses',
        function ($scope, $stateParams, Courses, CoursesService, Schoolclasses) {


            $scope.slaveCourses = [];
            $scope.cards = [];

            $scope.findData = function () {
                $scope.course = Courses.get({
                    courseId: $stateParams.courseId
                });
                $scope.schoolclass = Schoolclasses.get({
                    schoolclassId: $stateParams.schoolclassId
                });

            };

            $scope.loadUsageData = function (slave) {


                $scope.slaveCourses[slave] = Courses.get({
                    courseId: slave
                });


            };

            $scope.loadCalendarFor = function (slave) {
                var res = CoursesService.serverLoadCards();
                var promise = res.get({courseId: slave});
                promise.$promise.then(function (cards) {
                    $scope.init(cards);
                });
            };


            $scope.width = 720;
            $scope.height = 100;
            $scope.cellSize = 12;

            $scope.day = d3.time.format('%w');
            $scope.week = d3.time.format('%U');
            $scope.percent = d3.format('.1%');
            $scope.format = d3.time.format('%Y-%m-%d');


            $scope.init = function (cards) {

                //console.log(cards);

                var data = [];
                //data['2010-10-01'] = 0.037035252073270622;
                //data['2010-09-30'] = -0.044213895215559915;
                //data['2010-09-29'] = -0.02090628275240782;
                //data['2010-09-28'] = 0.04467222024357327;
                //data['2010-09-27'] = -0.004418956485387221;

                for (var i = 0; i < cards.length; i++) {
                    var card = cards[i];
                    for (var j = 0; j < cards[i].history.length; j++) {
                        var q = cards[i].history[j];
                        var year = new Date(q.when).getFullYear();
                        var month = new Date(q.when).getMonth() + 1;
                        var day = new Date(q.when).getDate();
                        var key = year + '-0' + month + '-' + day;
                        if (month > 9) {
                            key = year + '-' + month + '-' + day;
                        }

                        if (data[key]) {
                            data[key] += 1;
                        } else {
                            data[key] = 1;
                        }
                    }
                    //console.log(card.question+': '+card.history);
                }

                var color = d3.scale.quantize()
                    .domain([0, 500])
                    .range(d3.range(11).map(function (d) {
                        return 'q' + d + '-11';
                    }));

                var svg = d3.select('#cal');
                svg.selectAll('*').remove();

                svg = d3.select('#cal').selectAll('svg')
                    .data(d3.range(2015, 2016))
                    .enter().append('svg')
                    .attr('width', '100%')
                    //.attr('height', $scope.height)
                    .attr('class', 'Greens')
                    .append('g')
                    .attr('transform', 'translate(' + (($scope.width - $scope.cellSize * 53) / 2) + ',' + ($scope.height - $scope.cellSize * 7 - 1) + ')')
                    //.on('mouseover', function(d){
                    //    d3.select(this).classed('cell-hover',true);
                    //    d3.select('#tooltip')
                    //    .style('left', (d3.event.pageX+10) + 'px')
                    //    .style('top', (d3.event.pageY-10) + 'px')
                    //    .select('#value')
                    //    .text(d);
                    //    d3.select('#tooltip').classed('hidden', false);
                    //})
                    //.on('mouseout', function(){
                    //    d3.select(this).classed('cell-hover',false);
                    //    d3.select('#tooltip').classed('hidden', true);
                    //})
                ;

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
                    .datum($scope.format)
                    .on('mouseover', function(d){
                        d3.select(this).classed('cell-hover',true);
                        d3.select('#tooltip')
                            .style('left', (d3.event.pageX+10) + 'px')
                            .style('top', (d3.event.pageY-10) + 'px')
                            .select('#value')
                            .text(d +': ' + (data[d] || '0'));
                        d3.select('#tooltip').classed('hidden', false);
                    })
                    .on('mouseout', function(){
                        d3.select(this).classed('cell-hover',false);
                        d3.select('#tooltip').classed('hidden', true);
                    })
                    ;




                rect.append('title')
                    .text(function (d) { return d; });

                svg.selectAll('.month')
                    .data(function (d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
                    .enter().append('path')
                    .attr('class', 'month')
                    .attr('d', $scope.monthPath);


                rect.filter(function (d) { return d in data; })
                    .attr('class', function (d) { return 'day ' + color(data[d]); });
                    //.select('title')
                    //.text(function (d) { return d + ': ' + $scope.percent(data[d]);});


            };


            $scope.monthPath = function (t0) {
                var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                    d0 = +$scope.day(t0), w0 = +$scope.week(t0),
                    d1 = +$scope.day(t1), w1 = +$scope.week(t1);
                return 'M' + (w0 + 1) * $scope.cellSize + ',' + d0 * $scope.cellSize +
                    'H' + w0 * $scope.cellSize + 'V' + 7 * $scope.cellSize +
                    'H' + w1 * $scope.cellSize + 'V' + (d1 + 1) * $scope.cellSize +
                    'H' + (w1 + 1) * $scope.cellSize + 'V' + 0 +
                    'H' + (w0 + 1) * $scope.cellSize + 'Z';
            };

        }
    ]);
