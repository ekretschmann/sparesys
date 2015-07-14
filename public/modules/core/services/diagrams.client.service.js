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
                width = 680 - margin.left - margin.right,
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



        this.liquidFillGaugeDefaultSettings = function () {
            return {
                minValue: 0, // The gauge minimum value.
                maxValue: 100, // The gauge maximum value.
                circleThickness: 0.05, // The outer circle thickness as a percentage of it's radius.
                circleFillGap: 0.05, // The size of the gap between the outer circle and wave circle as a percentage of the outer circles radius.
                circleColor: '#178BCA', // The color of the outer circle.
                waveHeight: 0.1, // The wave height as a percentage of the radius of the wave circle.
                waveCount: 1, // The number of full waves per width of the wave circle.
                waveRiseTime: 1000, // The amount of time in milliseconds for the wave to rise from 0 to it's final height.
                waveAnimateTime: 18000, // The amount of time in milliseconds for a full wave to enter the wave circle.
                waveRise: true, // Control if the wave should rise from 0 to it's full height, or start at it's full height.
                waveHeightScaling: true, // Controls wave size scaling at low and high fill percentages. When true, wave height reaches it's maximum at 50% fill, and minimum at 0% and 100% fill. This helps to prevent the wave from making the wave circle from appear totally full or empty when near it's minimum or maximum fill.
                waveAnimate: true, // Controls if the wave scrolls or is static.
                waveColor: '#178BCA', // The color of the fill wave.
                waveOffset: 0, // The amount to initially offset the wave. 0 = no offset. 1 = offset of one full wave.
                textVertPosition: 0.5, // The height at which to display the percentage text withing the wave circle. 0 = bottom, 1 = top.
                textSize: 1, // The relative height of the text to display in the wave circle. 1 = 50%
                valueCountUp: true, // If true, the displayed value counts up from 0 to it's final value upon loading. If false, the final value is displayed.
                displayPercent: true, // If true, a % symbol is displayed after the value.
                textColor: '#045681', // The color of the value text when the wave does not overlap it.
                waveTextColor: '#A4DBf8' // The color of the value text when the wave overlaps it.
            };
        };

        this.loadLiquidFillGauge = function (elementId, value, config) {



            if (config === null) config = this.liquidFillGaugeDefaultSettings();



           // console.log(elementId);

            var gauge = d3.select('#' + elementId);

            gauge.selectAll('*').remove();

            if (!gauge[0][0]) {
                return;
            }
            var radius = Math.min(parseInt(gauge.style('width')), parseInt(gauge.style('height'))) / 2;
            var locationX = parseInt(gauge.style('width')) / 2 - radius;
            var locationY = parseInt(gauge.style('height')) / 2 - radius;
            var fillPercent = Math.max(config.minValue, Math.min(config.maxValue, value)) / config.maxValue;

            var waveHeightScale;
            if (config.waveHeightScaling) {
                waveHeightScale = d3.scale.linear()
                    .range([0, config.waveHeight, 0])
                    .domain([0, 50, 100]);
            } else {
                waveHeightScale = d3.scale.linear()
                    .range([config.waveHeight, config.waveHeight])
                    .domain([0, 100]);
            }

            var textPixels = (config.textSize * radius / 2);
            var textFinalValue = parseFloat(value).toFixed(2);
            var textStartValue = config.valueCountUp ? config.minValue : textFinalValue;
            var percentText = config.displayPercent ? '%' : '';
            var circleThickness = config.circleThickness * radius;
            var circleFillGap = config.circleFillGap * radius;
            var fillCircleMargin = circleThickness + circleFillGap;
            var fillCircleRadius = radius - fillCircleMargin;
            var waveHeight = fillCircleRadius * waveHeightScale(fillPercent * 100);

            var waveLength = fillCircleRadius * 2 / config.waveCount;
            var waveClipCount = 1 + config.waveCount;
            var waveClipWidth = waveLength * waveClipCount;

            // Rounding functions so that the correct number of decimal places is always displayed as the value counts up.
            var textRounder = function (value) {
                return Math.round(value);
            };
            if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
                textRounder = function (value) {
                    return parseFloat(value).toFixed(1);
                };
            }
            if (parseFloat(textFinalValue) !== parseFloat(textRounder(textFinalValue))) {
                textRounder = function (value) {
                    return parseFloat(value).toFixed(2);
                };
            }

            // Data for building the clip wave area.
            var data = [];
            for (var i = 0; i <= 40 * waveClipCount; i++) {
                data.push({x: i / (40 * waveClipCount), y: (i / (40))});
            }

            // Scales for drawing the outer circle.
            var gaugeCircleX = d3.scale.linear().range([0, 2 * Math.PI]).domain([0, 1]);
            var gaugeCircleY = d3.scale.linear().range([0, radius]).domain([0, radius]);

            // Scales for controlling the size of the clipping path.
            var waveScaleX = d3.scale.linear().range([0, waveClipWidth]).domain([0, 1]);
            var waveScaleY = d3.scale.linear().range([0, waveHeight]).domain([0, 1]);

            // Scales for controlling the position of the clipping path.
            var waveRiseScale = d3.scale.linear()
                // The clipping area size is the height of the fill circle + the wave height, so we position the clip wave
                // such that the it will won't overlap the fill circle at all when at 0%, and will totally cover the fill
                // circle at 100%.
                .range([(fillCircleMargin + fillCircleRadius * 2 + waveHeight), (fillCircleMargin - waveHeight)])
                .domain([0, 1]);
            var waveAnimateScale = d3.scale.linear()
                .range([0, waveClipWidth - fillCircleRadius * 2]) // Push the clip area one full wave then snap back.
                .domain([0, 1]);

            // Scale for controlling the position of the text within the gauge.
            var textRiseScaleY = d3.scale.linear()
                .range([fillCircleMargin + fillCircleRadius * 2, (fillCircleMargin + textPixels * 0.7)])
                .domain([0, 1]);

            // Center the gauge within the parent SVG.
            var gaugeGroup = gauge.append('g')
                .attr('transform', 'translate(' + locationX + ',' + locationY + ')');

            // Draw the outer circle.
            var gaugeCircleArc = d3.svg.arc()
                .startAngle(gaugeCircleX(0))
                .endAngle(gaugeCircleX(1))
                .outerRadius(gaugeCircleY(radius))
                .innerRadius(gaugeCircleY(radius - circleThickness));
            gaugeGroup.append('path')
                .attr('d', gaugeCircleArc)
                .style('fill', config.circleColor)
                .attr('transform', 'translate(' + radius + ',' + radius + ')');

            // Text where the wave does not overlap.
            var text1 = gaugeGroup.append('text')
                .text(textRounder(textStartValue) + percentText)
                .attr('class', 'liquidFillGaugeText')
                .attr('text-anchor', 'middle')
                .attr('font-size', textPixels + 'px')
                .style('fill', config.textColor)
                .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

            // The clipping wave area.
            var clipArea = d3.svg.area()
                .x(function (d) {
                    return waveScaleX(d.x);
                })
                .y0(function (d) {
                    return waveScaleY(Math.sin(Math.PI * 2 * config.waveOffset * -1 + Math.PI * 2 * (1 - config.waveCount) + d.y * 2 * Math.PI));
                })
                .y1(function (d) {
                    return (fillCircleRadius * 2 + waveHeight);
                });
            var waveGroup = gaugeGroup.append('defs')
                .append('clipPath')
                .attr('id', 'clipWave' + elementId);
            var wave = waveGroup.append('path')
                .datum(data)
                .attr('d', clipArea);

            // The inner circle with the clipping wave attached.
            var fillCircleGroup = gaugeGroup.append('g')
                .attr('clip-path', 'url(#clipWave' + elementId + ')');
            fillCircleGroup.append('circle')
                .attr('cx', radius)
                .attr('cy', radius)
                .attr('r', fillCircleRadius)
                .style('fill', config.waveColor);

            // Text where the wave does overlap.
            var text2 = fillCircleGroup.append('text')
                .text(textRounder(textStartValue) + percentText)
                .attr('class', 'liquidFillGaugeText')
                .attr('text-anchor', 'middle')
                .attr('font-size', textPixels + 'px')
                .style('fill', config.waveTextColor)
                .attr('transform', 'translate(' + radius + ',' + textRiseScaleY(config.textVertPosition) + ')');

            // Make the value count up.
            if (config.valueCountUp) {
                var textTween = function () {
                    var i = d3.interpolate(this.textContent, textFinalValue);
                    return function (t) {
                        this.textContent = textRounder(i(t)) + percentText;
                    };
                };
                text1.transition()
                    .duration(config.waveRiseTime)
                    .tween('text', textTween);
                text2.transition()
                    .duration(config.waveRiseTime)
                    .tween('text', textTween);
            }

            // Make the wave rise. wave and waveGroup are separate so that horizontal and vertical movement can be controlled independently.
            var waveGroupXPosition = fillCircleMargin + fillCircleRadius * 2 - waveClipWidth;
            if (config.waveRise) {
                waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(0) + ')')
                    .transition()
                    .duration(config.waveRiseTime)
                    .attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')')
                    .each('start', function () {
                        wave.attr('transform', 'translate(1,0)');
                    }); // This transform is necessary to get the clip wave positioned correctly when waveRise=true and waveAnimate=false. The wave will not position correctly without this, but it's not clear why this is actually necessary.
            } else {
                waveGroup.attr('transform', 'translate(' + waveGroupXPosition + ',' + waveRiseScale(fillPercent) + ')');
            }

            var animateWave = function () {
                wave.transition()
                    .duration(config.waveAnimateTime)
                    .ease('linear')
                    .attr('transform', 'translate(' + waveAnimateScale(1) + ',0)')
                    .each('end', function () {
                        wave.attr('transform', 'translate(' + waveAnimateScale(0) + ',0)');
                        animateWave(config.waveAnimateTime);
                    });
            };

            if (config.waveAnimate) {
                animateWave();
            }


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

        this.drawCalendar = function (cards, id) {


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
])
;
