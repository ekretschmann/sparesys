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
        var key = '';


        this.drawLineChart = function (cards, id) {

            var d = [];
            var earliestDate = Date.now();


            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                if (card.history.length === 0) {
                    continue;
                }
                key = this.getDateKey(card.history[0].when);
                if(card.history[0].when < earliestDate) {
                    earliestDate = card.history[0].when;
                }
                if (d[key]) {
                    d[key] = d[key] + 1;
                } else {
                    d[key] = 1;
                }
            }

            var cursor = earliestDate;
            var now = Date.now();
            var total = 0;
            while (cursor < now) {

                key = this.getDateKey(cursor);

                if (d[key]) {
                    total += d[key];
                    d[key] = total;
                }
                cursor += 1000*60*60*24;
            }


            d[this.getDateKey(earliestDate - 1000*60*60*24)] = 0;
            d[this.getDateKey(Date.now())] = total;


            //var parseDate = d3.time.format('%Y-%m-%d').parse;

            var data = [];
            Object.keys(d).sort().forEach(function(key) {
                var point = {};

                point.date = d3.time.format('%Y-%m-%d').parse(key);

                point.close = d[key];
                data.push(point);

            }, this);


            var margin = {top: 20, right: 20, bottom: 30, left: 50},
                width =  920 - margin.left - margin.right,
                height = 300 - margin.top - margin.bottom;


            var x = d3.time.scale()
                .range([0, width]);

            var y = d3.scale.linear()
                .range([height, 0]);

            var xAxis = d3.svg.axis()
                .scale(x)
                .orient('bottom');

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient('left');

            var line = d3.svg.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.close); });

            var svg = d3.select(id).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .attr('background-color', '#FF0000')
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');



                x.domain(d3.extent(data, function (d) {
                    return d.date;
                }));
                y.domain(d3.extent(data, function (d) {
                    return d.close;
                }));

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
                    .text('Cards');

                svg.append('path')
                    .datum(data)
                    .attr('class', 'line')
                    .attr('d', line);


        };




        this.getDateKey = function (when) {
            var date = new Date(when);

            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var d = date.getDate();
            var key = year;
            if (month > 9) {

                key += '-' + month;
            } else {
                key += '-0' + month;
            }

            if (d > 9) {
                key += '-' + d;
            } else {
                key += '-0' + d;
            }
            return key;
        };

        this.drawCalendar = function (cards, id, practiceDateId, numberOfCardsId) {


            var data = [];

            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                for (var j = 0; j < cards[i].history.length; j++) {
                    var q = cards[i].history[j];


                    var key = this.getDateKey(q.when);
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
                .attr('width', '920px')
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
                        d3.select(practiceDateId).text(d+': ');
                        d3.select(numberOfCardsId).text((data[d] || '0'));

                    })
                    .on('mouseout', function () {
                        d3.select(this).classed('cell-hover', false);
                        d3.select(practiceDateId).text('');
                        d3.select(numberOfCardsId).text('');

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
])
;
