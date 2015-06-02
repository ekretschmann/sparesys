'use strict';

/* global d3 */
angular.module('core').service('DiagramsService', [
    function () {


        var width = 720;
        var height = 100;
        var cellSize = 12;

        var day = d3.time.format('%w');
        var week = d3.time.format('%U');
        var percent = d3.format('.1%');

        var format = d3.time.format('%Y-%m-%d');



        this.drawCalendar = function (cards, id) {


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
                    var d = new Date(q.when).getDate();
                    var key = year;
                    if (month > 9) {

                        key +=  '-' + month ;
                    } else {
                        key +=  '-0' + month ;
                    }

                    if (d > 9) {
                        key +=  '-' + d ;
                    } else {
                        key +=  '-0' + d ;
                    }

                    if (data[key]) {
                        data[key] += 1;
                    } else {
                        data[key] = 1;
                    }
                }
            }


            var color = d3.scale.quantize()
                .domain([0, 500])
                .range(d3.range(11).map(function (d) {
                    return 'q' + d + '-11';
                }));

            var svg = d3.select(id);
            svg.selectAll('*').remove();

            svg = d3.select(id).selectAll('svg')
                .data(d3.range(2015, 2016))
                .enter().append('svg')
                .attr('width', '100%')
                .attr('class', 'Greens')
                .append('g')
                .attr('transform', 'translate(' + ((width - cellSize * 53) / 2) + ',' + (height - cellSize * 7 - 1) + ')')

            ;

            svg.append('text')
                .attr('transform', 'translate(-6,' + cellSize * 3.5 + ')rotate(-90)')
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
                    .attr('width', cellSize)
                    .attr('height', cellSize)
                    .attr('x', function (d) {
                        return week(d) * cellSize;
                    })
                    .attr('y', function (d) {
                        return day(d) * cellSize;
                    })
                    .datum(format)
                    .on('mouseover', function (d) {
                        d3.select(this).classed('cell-hover', true);
                        d3.select('#tooltip')
                            .style('left', (d3.event.pageX + 10) + 'px')
                            .style('top', (d3.event.pageY - 10) + 'px')
                            .select('#value')
                            .text(d + ': ' + (data[d] || '0'));
                        d3.select('#tooltip').classed('hidden', false);
                    })
                    .on('mouseout', function () {
                        d3.select(this).classed('cell-hover', false);
                        d3.select('#tooltip').classed('hidden', true);
                    })
                ;




            svg.selectAll('.month')
                .data(function (d) {
                    return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
                })
                .enter().append('path')
                .attr('class', 'month')
                .attr('d', this.monthPath);


            rect.filter(function (d) {
                return d in data;
            })
                .attr('class', function (d) {
                    return 'day ' + color(data[d]);
                });


        };


        this.monthPath = function (t0) {
            var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
                d0 = +day(t0), w0 = +week(t0),
                d1 = +day(t1), w1 = +week(t1);
            return 'M' + (w0 + 1) * cellSize + ',' + d0 * cellSize +
                'H' + w0 * cellSize + 'V' + 7 * cellSize +
                'H' + w1 * cellSize + 'V' + (d1 + 1) * cellSize +
                'H' + (w1 + 1) * cellSize + 'V' + 0 +
                'H' + (w0 + 1) * cellSize + 'Z';
        };

    }
]);
