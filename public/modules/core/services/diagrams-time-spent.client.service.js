'use strict';

/* global d3 */
angular.module('core').service('DiagramsTimeSpentService', ['$timeout',
    function ($timeout) {


        this.drawBarChart = function (cards, id, windwoWidth) {



            var margin = {top: 40, right: 20, bottom: 30, left: 40},
                width = 960 - margin.left - margin.right,
                height = 500 - margin.top - margin.bottom;

            var formatPercent = d3.format('.0%');

            var x = d3.scale.ordinal()
                .rangeRoundBands([0, width], 0.1);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left')
                .tickFormat(formatPercent);

            //var tip = d3.tip()
            //    .attr('class', 'd3-tip')
            //    .offset([-10, 0])
            //    .html(function (d) {
            //        return '<strong>Frequency:</strong> <span style='color:red'>' + d.frequency + '</span>';
            //    })

            var svg = d3.select(id).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            //svg.call(tip);

            //d3.tsv('data.tsv', type, function(error, data) {

            var data = [];
            data.push({letter: 'A', frequency:10});
            data.push({letter: 'B', frequency:30});
            data.push({letter: 'C', frequency:20});
            x.domain(data.map(function (d) {
                return d.letter;
            }));
            y.domain([0, d3.max(data, function (d) {
                return d.frequency;
            })]);

            svg.append('g')
                .attr('class', 'x axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);

            svg.append('g')
                .attr('class', 'y axis')
                .call(yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Frequency');

            svg.selectAll('.bar')
                .data(data)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', function (d) {
                    return x(d.letter);
                })
                .attr('width', x.rangeBand())
                .attr('y', function (d) {
                    return y(d.frequency);
                })
                .attr('height', function (d) {
                    return height - y(d.frequency);
                });
                //.on('mouseover', tip.show)
                //.on('mouseout', tip.hide);


            //
            //    cellSize = windowWidth/60;
            //
            //
            //    var data = [];
            //
            //    for (var i = 0; i < cards.length; i++) {
            //        var card = cards[i];
            //        for (var j = 0; j < cards[i].history.length; j++) {
            //            var q = cards[i].history[j];
            //
            //
            //            var key = this.getDateKey(q.when);
            //            if (data[key]) {
            //                data[key] += 1;
            //            } else {
            //                data[key] = 1;
            //            }
            //        }
            //    }
            //
            //
            //    var color = d3.scale.quantize()
            //        .domain([0, 500])
            //        .range(d3.range(11).map(function (d) {
            //            return 'q' + d + '-11';
            //        }));
            //
            //    var svg = d3.select(id);
            //    svg.selectAll('*').remove();
            //
            //
            //    svg = d3.select(id).selectAll('svg')
            //        .data(d3.range(2015, 2016))
            //        .enter().append('svg')
            //        .attr('width', windowWidth+'px')
            //        .attr('class', 'Greens')
            //        .append('g')
            //        .attr('transform', 'translate(' + ((windowWidth - cellSize * 53) / 2) + ',' + (height - cellSize * 7 - 1) + ')')
            //
            //    ;
            //
            //    svg.append('text')
            //        .attr('transform', 'translate(-6,' + cellSize * 3.5 + ')rotate(-90)')
            //        .style('text-anchor', 'middle')
            //        .text(function (d) {
            //            return d;
            //        });
            //
            //    var rect = svg.selectAll('.day')
            //            .data(function (d) {
            //                return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
            //            })
            //            .enter().append('rect')
            //            .attr('class', 'day')
            //            .attr('width', cellSize)
            //            .attr('height', cellSize)
            //            .attr('x', function (d) {
            //                return week(d) * cellSize;
            //            })
            //            .attr('y', function (d) {
            //                return day(d) * cellSize;
            //            })
            //            .datum(format)
            //            .on('mouseover', function (d) {
            //                d3.select(this).classed('cell-hover', true);
            //                d3.select(practiceDateId).text(d+': ');
            //                d3.select(numberOfCardsId).text((data[d] || '0'));
            //
            //            })
            //            .on('mouseout', function () {
            //                d3.select(this).classed('cell-hover', false);
            //                d3.select(practiceDateId).text('');
            //                d3.select(numberOfCardsId).text('');
            //
            //            })
            //        ;
            //
            //
            //    svg.selectAll('.month')
            //        .data(function (d) {
            //            return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1));
            //        })
            //        .enter().append('path')
            //        .attr('class', 'month')
            //        .attr('d', this.monthPath);
            //
            //
            //    rect.filter(function (d) {
            //        return d in data;
            //    })
            //        .attr('class', function (d) {
            //            return 'day ' + color(data[d]);
            //        });
            //
            //
        };


    }
])
;
