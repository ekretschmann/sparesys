'use strict';

/* global d3 */
angular.module('core').service('DiagramsCardsInPlayService', [
    function () {



        var key = '';

        this.drawLineChart = function (cards, id, totalCardsLearnedId, windwoWidth) {


            var d = [];
            var earliestDate = Date.now();

            var totalCardsLearned = 0;

            for (var i = 0; i < cards.length; i++) {
                var card = cards[i];
                if (card.history.length === 0) {
                    continue;
                }
                totalCardsLearned ++;
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
                width =  windwoWidth - margin.left - margin.right - 230,
                height = 310 - margin.top - margin.bottom;


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

            if (totalCardsLearned) {
                d3.select(totalCardsLearnedId).text(totalCardsLearned+' cards');
            }
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
                    .call(yAxis);
                    //.append('text')
                    //.attr('transform', 'rotate(-90)')
                    //.attr('y', 6)
                    //.attr('dy', '.71em')
                    //.style('text-anchor', 'end')
                    //.text('Cards');

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






    }
])
;
