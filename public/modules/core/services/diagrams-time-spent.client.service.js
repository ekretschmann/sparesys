'use strict';

/* global d3 */
angular.module('core').service('DiagramsTimeSpentService', ['$timeout',
    function ($timeout) {


        this.getPracticePerDay = function (cards) {
            var days = {};
            var earliest;
            var latest;
            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                for (var j = 0; j < cards[i].history.length; j++) {
                    var q = cards[i].history[j].when;

                    if (!earliest || earliest > q) {
                        earliest = q;
                    }

                    if (!latest || latest < q) {
                        latest = q;
                    }

                    var key = this.getDateKey(q);
                    if (!days[key]) {
                        days[key] = [];
                    }
                    days[key].push(q);
                }
            }
            return {practicePerDay: days, earliest: earliest, latest: latest};
        };

        this.drawBarChart = function (cards, id, practiceDateId, timeSpentId, spentAllTimeId,windwoWidth) {


            var practiceData = this.getPracticePerDay(cards);

            var days = practiceData.practicePerDay;
            var earliest = practiceData.earliest;
            var latest = practiceData.latest;


            var current = earliest;
            var dayInMs = 1000 * 60 * 60 * 24;
            var totals = [];
            var maxTotal = 0;
            var timeSpentTotal = 0;
            while (current < latest + dayInMs) {

                var stamps = days[this.getDateKey(current)];


                if (stamps) {
                    var sortedStamps = stamps.sort();
                    var totalTime = 0;
                    for (var i = 0; i < sortedStamps.length; i++) {
                        var diff = 0;
                        if (sortedStamps[i + 1]) {
                            diff = sortedStamps[i + 1] - sortedStamps[i];
                        } else {
                            // 10s for the last card
                            diff = 10000;
                        }

                        if (diff > 1000 * 60 * 3) {
                            diff = 10000;
                        }
                        totalTime += diff;

                    }

                    totalTime = totalTime / (1000 * 60);

                    if (totalTime > maxTotal) {
                        maxTotal = totalTime;
                    }
                    totals.push({date: this.getDateKey(current), time: totalTime});
                    timeSpentTotal += totalTime;

                } else {
                    totals.push({date: this.getDateKey(current), time: 0});
                }
                current += dayInMs;
            }


            var margin = {top: 16, right: 20, bottom: 30, left: 40},
                width = windwoWidth - margin.left - margin.right,
                height = 340 - margin.top - margin.bottom;

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
                .orient('left');
            //.tickFormat(formatPercent);


            var svg = d3.select(id).append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            d3.select(spentAllTimeId).text(Math.ceil(timeSpentTotal) + ' min');

            x.domain(totals.map(function (d) {
                return d.date;
                //return 'A';
            }));
            y.domain([0, d3.max(totals, function (d) {
                //return d.totalTime / 1000;
                return maxTotal * 1.2;
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
                .text('Minutes');

            svg.selectAll('.bar')
                .data(totals)
                .enter().append('rect')
                .attr('class', 'bar')
                .attr('x', function (d) {
                    return x(d.date);
                })
                .attr('width', x.rangeBand())
                .attr('y', function (d) {
                    return y(d.time);
                })
                .attr('height', function (d) {
                    return height - y(d.time);
                })
                .on('mouseover', function (d) {
                    d3.select(this).classed('cell-hover', true);
                    d3.select(practiceDateId).text(d.date+': ');
                    d3.select(timeSpentId).text(Math.ceil(d.time) + ' min');

                })
                .on('mouseout', function () {
                    d3.select(this).classed('cell-hover', false);
                    d3.select(practiceDateId).text('');
                    d3.select(timeSpentId).text('');

                });

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

    }
])
;
