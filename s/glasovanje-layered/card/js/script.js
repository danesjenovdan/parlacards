function groupBy(array, f) {
    var groups = {};
    array.forEach(function(o) {
        var group = JSON.stringify(f(o));
        groups[group] = groups[group] || [];
        groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
        return groups[group];
    })
}

function drawLabelLines(labels) {
    labels.each(function(d) {
        var thing = d3.select(this);
        var bbox = this.getBBox();
        d.sx = +thing.attr('x') - bbox.width / 2 - 2;
        d.ox = +thing.attr('x') + bbox.width / 2 + 2;
        d.sy = d.oy = +thing.attr('y') + 5;
        d.endx = +thing.attr('x') + bbox.width;
    });

    svg.selectAll("path.pointer").data(piedata).enter()
        .append("path")
        .attr("class", "pointer")
        .style("fill", "none")
        .attr("d", function(d) {
            if (d.cx > d.ox) { //|| Math.abs(d.cx) < 0.1) {
                return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * 1.9 + "," + d.cy * 1.9;
            } else {
                if ((d.endx > 0) && (Math.abs(d.cx) < 10)) {
                    return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * 1.9 + "," + d.cy * 1.9;
                }
                return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx * 1.9 + "," + d.cy * 1.9;
            }
        })
        .style('display', function(d) {
            if (+d.data.percentage === 0) {
                return 'none';
            } else {
                return 'block';
            }
        });
}

function drawPie(data) {
    console.log('starting drawOuter');
    var arc = d3.svg.arc()
        .outerRadius(radius * 1.5 - 10);


    var labelArc = d3.svg.arc()
        .outerRadius(radius * 1.5 - 50)
        .innerRadius(radius * 1.5 - 100);


    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.mps.length;
        });

    var piedata = pie(data);

    // var bigg = svg.selectAll('.arc-container')
    //     .data(grouped_data);


    var g = svg.selectAll('.arc2')
        .data(piedata)
        .enter()
        .append('g')
        .classed('arc2', true);

    g.append('path')
        .attr('d', arc)
        .style('fill', function(d) {
            return color(d.data.option);
        })
        .attr("d", arc)
        .style('stroke', function(d) {
            return color(d.data.option);
        })
        .attr('class', function(d) {
            return d.data.option + '-arc'
        })
        .style('stroke-width', 0)
        .on('click', function(d) {
            var mp_list = d3.select('.' + d.data.option + '.' + d.data.pg.acronym.replace(' ', '_'));

            mp_list.classed('hidden', !mp_list.classed('hidden'));

            _this = d3.select(this);

            if (_this.classed('selected')) {
                _this.attr('transform', function(d) {
                        return 'translate(0, 0)';
                    })
                    .classed('selected', false);
            } else {
                _this.attr('transform', function(d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        return 'translate(' + Math.cos(a) * (radius * 0.2) + ',' + Math.sin(a) * (radius * 0.2) + ')';
                    })
                    .classed('selected', true);
            }
        })
        .on("mouseover", function(d) { // setup tooltip

            var startTranslateState = 'translate(0, 0)';

            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;

            var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.1) + ',' + Math.sin(a) * (radius * 0.1) + ')';

            function translateOutInterpolator() {
                return d3.interpolateString(startTranslateState, endTranslateState);
            }
            function translateInInterpolator() {
                return d3.interpolateString(endTranslateState, startTranslateState);
            }

            console.log('I am over ' + d.data.option);
            d3.selectAll('.' + d.data.option + '--')
                .style('opacity', 1);

            // console.log(d3.selectAll('.' + d.data.option + '-arc'));
            d3.selectAll('.' + d.data.option + '-arc')
                .transition()
                .duration(500)
                .attrTween('transform', translateOutInterpolator);
        })
        .on("mouseout", function(d) {

            var startTranslateState = 'translate(0, 0)';

            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;

            var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.1) + ',' + Math.sin(a) * (radius * 0.1) + ')';

            function translateOutInterpolator() {
                return d3.interpolateString(startTranslateState, endTranslateState);
            }
            function translateInInterpolator() {
                return d3.interpolateString(endTranslateState, startTranslateState);
            }

            console.log('I am out of ' + d.data.option);
            d3.selectAll('.' + d.data.option + '--')
                .style('opacity', 0);

            d3.selectAll('.' + d.data.option + '-arc')
                .transition()
                .duration(500)
                .attrTween('transform', translateInInterpolator);
        });

}

function drawLabels(data) {
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.mps.length;
        });

    var piedata = pie(data);

    var labels = svg.selectAll("text").data(piedata)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cx = Math.cos(a) * (radius * 1.5 - 73);
            return d.x = Math.cos(a) * (radius * 1.5 + 25);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cy = Math.sin(a) * (radius * 1.5 - 73);
            return d.y = Math.sin(a) * (radius * 1.5 + 25);
        })
        .attr('class', function(d) {
            return d.data.option + '--'
        })
        .classed('label', true)
        .text(function(d) {
            return d.data.pg.acronym + ' | ' + d.data.mps.length;
        })
        .each(function(d) {
            var bbox = this.getBBox();
            d.sx = d.x - bbox.width / 2 - 2;
            d.ox = d.x + bbox.width / 2 + 2;
            d.sy = d.oy = d.y + 5;
        });

    var alpha = 0.5;
    var spacingY = 20;
    var spacingX = 30;

    function relax(labels) {

        again = false;
        labels.each(function(d, i) {
            a = this;
            da = d3.select(a);
            y1 = da.attr('y');
            x1 = da.attr('x');

            labels.each(function(d, j) {
                b = this;
                if (a == b) return;
                db = d3.select(b);
                y2 = db.attr('y');
                x2 = db.attr('x');

                deltaY = y1 - y2;
                deltaX = x1 - x2;

                // handle X & Y spacing
                if (Math.abs(deltaY) > spacingY || Math.abs(deltaX) > spacingX) {
                    return;
                } else {
                    // if we didn't break until now, labels are overlapping
                    again = true;

                    sign = deltaY > 0 ? 1 : -1;
                    adjust = sign * alpha;
                    da.attr('y', +y1 + adjust);
                    db.attr('y', +y2 - adjust);

                    sign = deltaX > 0 ? 1 : -1;
                    adjust = sign * alpha;
                    da.attr('x', +x1 + adjust);
                    db.attr('x', +x2 - adjust);
                }

                // // handle Y spacing
                // if (Math.abs(deltaY) > spacingY) {
                //     return;
                // } else {
                //     // if we didn't break until now, labels are overlapping
                //     again = true;
                //     sign = deltaY > 0 ? 1 : -1;
                //     adjust = sign * alpha;
                //     da.attr('y', +y1 + adjust);
                //     db.attr('y', +y2 - adjust);
                // }
                //
                // // handle X spacing
                // if (Math.abs(deltaX) > spacingX) {
                //     return;
                // } else {
                //     // if we didn't break until now, labels are overlapping
                //     again = true;
                //     sign = deltaX > 0 ? 1 : -1;
                //     adjust = sign * alpha;
                //     da.attr('x', +x1 + adjust);
                //     db.attr('x', +x2 - adjust);
                // }

            });
        });

        if (again) {
            setTimeout(relax(labels), 20);
        } else {
            // var linestodraw = d3.selectAll('.' + d3.select(labels).node().datum().data.option + '--');
            // drawLines(labels);
        }

    }


    groupedData = groupBy(second_level_data, function(item) {
        return [item.option]
    });

    for (i in groupedData) {
        var group_of_labels = d3.selectAll('.' + groupedData[i][0]['option'] + '--');
        relax(group_of_labels);
    }

    function drawLines(labels) {

        labels.each(function(d) {
            var thing = d3.select(this);
            var bbox = this.getBBox();
            d.sx = +thing.attr('x') - bbox.width / 2 - 2;
            d.ox = +thing.attr('x') + bbox.width / 2 + 2;
            d.sy = d.oy = +thing.attr('y') + 5;
            d.endx = +thing.attr('x') + bbox.width;
        });

        svg.selectAll("path.pointer").data(piedata).enter()
            .append("path")
            .attr("class", "pointer")
            .style("fill", "none")
            // .style("stroke", "black")
            // .attr("marker-end", "url(#circ)")
            .attr("d", function(d) {
                // console.log(d);
                if (d.cx > d.ox) { //|| Math.abs(d.cx) < 0.1) {
                    return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * 3.4 + "," + d.cy * 3.4;
                } else {
                    if ((d.endx > 0) && (Math.abs(d.cx) < 10)) {
                        return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * 3.4 + "," + d.cy * 3.4;
                    }
                    return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx * 3.4 + "," + d.cy * 3.4;
                }
            })
            .style('display', function(d) {
                if (+d.data.percentage === 0) {
                    return 'none';
                } else {
                    return 'block';
                }
            });
    }

    // svg.selectAll("path.pointer").data(piedata).enter()
    //     .append("path")
    //     .attr("class", "pointer")
    //     .style("fill", "none")
    //     .style("stroke", "black")
    //     .attr("marker-end", "url(#circ)")
    //     .attr("d", function(d) {
    //         if (d.cx > d.ox) {
    //             return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * 1.9 + "," + d.cy * 1.9;
    //         } else {
    //             return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx * 1.9 + "," + d.cy * 1.9;
    //         }
    //     });
}

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};
var width = 400 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var radius = Math.min(width, height) / 4.5;

var color = d3.scale.ordinal()
    .range(["#009CDD", "#00628C", "#99E1FF", "#003B54"]);

var svg = d3.select(".layeredchart").append("svg")
    .attr('viewBox', '0 0 400 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

var pieWidth = 200;

var second_level_data = [];
for (option in data.all) {
    for (party in data.all[option]['breakdown']) {
        // newdict = data.all[option]['breakdown'][party];
        // newdict['option'] = data.all[option]['option'];

        var newdict = data.all[option]['breakdown'][party];
        newdict.option = option;

        second_level_data.push(newdict);

    }
}

console.log(second_level_data);

drawPie(second_level_data);

drawLabels(second_level_data);
