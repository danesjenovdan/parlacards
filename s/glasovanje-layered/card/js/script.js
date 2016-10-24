// utilities
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

// draw the pie
function drawPie(data) {
    
    var arc = d3.svg.arc()
        .outerRadius(radius * 2 - 10);

    var labelArc = d3.svg.arc()
        .outerRadius(radius * 1.5 - 50)
        .innerRadius(radius * 1.5 - 100);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.mps.length;
        });

    var piedata = pie(data);

    var g = svg.selectAll('.arc')
        .data(piedata)
        .enter()
        .append('g')
        .classed('arc', true);

    g.append('path')
        .attr('d', arc)
        .attr('class', function(d) {
            return d.data.option + '-arc'
        })
        .style('fill', function(d) {
            return color(d.data.option);
        })
        .style('stroke', function(d) {
            return color(d.data.option);
        })
        .style('stroke-width', 0)
        .on('click', function(d) { // onclick events 

            // stop propagation
            console.log(d3.event);
            d3.event.stopPropagation();

            if (!d3.selectAll('.' + d.data.option + '-arc').classed('active')) { // !.active

                // hide option labels
                d3.selectAll('.label-option')
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
                d3.selectAll('.pointer-option')
                    .transition()
                    .duration(300)
                    .style('opacity', 0);

                // hide mps
                d3.selectAll('.mpgroup')
                    .classed('hidden', true);

                // translate currently active slices and hide labels of active elements
                // hide other party labels
                d3.selectAll('.label-party')
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
                d3.selectAll('.pointer-party')
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
                // demote currently chosen slices
                d3.selectAll('path.chosen')
                    .classed('chosen', false)
                    .transition()
                    .duration(300)
                    .attrTween('transform', function(d) {

                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        var startTranslateState = 'translate(' + Math.cos(a) * (radius * 0.1) + ',' + Math.sin(a) * (radius * 0.1) + ')';
                        var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                        return d3.interpolateString(startTranslateState, endTranslateState);
                    })
                // demote currently active slices
                d3.selectAll('path.active')
                    .classed('active', false)
                    .transition()
                    .delay(300)
                    .duration(300)
                    .attrTween('transform', function(d) {

                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                        return d3.interpolateString( endTranslateState, 'translate(0, 0)');
                    })

                // show labels
                d3.selectAll('.' + d.data.option + '-label-party')
                    .transition()
                    .duration(300)
                    .style('opacity', 1);
                d3.selectAll('.' + d.data.option + '-pointer-party')
                    .transition()
                    .duration(300)
                    .style('opacity', 1);

                // translate slices
                d3.selectAll('.' + d.data.option + '-arc')
                    .classed('active', true)
                    .transition()
                    .duration(300)
                    .attrTween('transform', function(d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                        return d3.interpolateString('translate(0, 0)', endTranslateState);
                    })
            } else { // .active

                if (!d3.select(this).classed('chosen')) { // !.chosen
                    // move slice further
                    d3.select(this)
                        .classed('chosen', true)
                        .transition()
                        .duration(300)
                        .attrTween('transform', function(d) {
                            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            var startTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                            var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.1) + ',' + Math.sin(a) * (radius * 0.1) + ')';
                            return d3.interpolateString(startTranslateState, endTranslateState);
                        })
                } else {
                    // move slice back
                    d3.select(this)
                        .classed('chosen', false)
                        .transition()
                        .duration(300)
                        .attrTween('transform', function(d) {
                            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            var startTranslateState = 'translate(' + Math.cos(a) * (radius * 0.1) + ',' + Math.sin(a) * (radius * 0.1) + ')';
                            var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                            return d3.interpolateString(startTranslateState, endTranslateState);
                        })
                }

                // togle mps
                var mp_list = d3.select('.' + d.data.option + '.' + d.data.pg.acronym.replace(' ', '_'));
                mp_list.classed('hidden', !mp_list.classed('hidden'));

            }
        })
        .on("mouseover", function(d) { // mouseover events

            if (!d3.selectAll('.' + d.data.option + '-arc').classed('active')) {

                d3.selectAll('.' + d.data.option + '-arc')
                    .transition()
                    .duration(300)
                    .attrTween('transform', function(d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                        return d3.interpolateString('translate(0, 0)', endTranslateState);
                    })
                    .transition()
                    .duration(300)
                    .attrTween('transform', function(d) {
                        var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                        return d3.interpolateString(endTranslateState, 'translate(0, 0)');
                    });
            }
        })
}

// draw option labels
function drawOptionLabels(data) {
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.total_votes;
        });

    var piedata = pie(data);

    var labels = svg.selectAll("text.option-label").data(piedata)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cx = Math.cos(a) * (radius * 2 - 73);
            return d.x = Math.cos(a) * (radius * 2 + 25);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cy = Math.sin(a) * (radius * 2 - 73);
            return d.y = Math.sin(a) * (radius * 2 + 25);
        })
        .attr('class', function(d) {
            return d.data.option + '-label-option'
        })
        .classed('label-option', true)
        .classed('label', true)
        .text(function(d) {
            var text = '';
            switch(d.data.option) {
                case 'kvorum':
                    text = 'VZDRŽANI';
                    break;
                case 'not_present':
                    text = 'NISO';
                    break;
                case 'for':
                    text = 'ZA'
                    break;
                case 'against':
                    text = 'PROTI'
                    break;
            }
            return text + ' | ' + d.data.total_votes;
        })
        .each(function(d) {
            var bbox = this.getBBox();
            d.sx = d.x - bbox.width / 2 - 2;
            d.ox = d.x + bbox.width / 2 + 2;
            d.sy = d.oy = d.y + 5;
        });
    
    function drawLines(labels) {

        labels.each(function(d) {
            var thing = d3.select(this);
            var bbox = this.getBBox();
            d.sx = +thing.attr('x') - bbox.width / 2 - 2;
            d.ox = +thing.attr('x') + bbox.width / 2 + 2;
            d.sy = d.oy = +thing.attr('y') + 5;
            d.endx = +thing.attr('x') + bbox.width;
        });

        svg.selectAll("path.pointer.pointer-option").data(piedata).enter()
            .append("path")
            .attr("class", "pointer")
            .classed('pointer-option', true)
            .style("fill", "none")
            .attr("d", function(d) {

                var w = 2.1;

                if (d.cx > d.ox) { //|| Math.abs(d.cx) < 0.1) {
                    return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * w + "," + d.cy * w;
                } else {
                    if ((d.endx > 0) && (Math.abs(d.cx) < 10)) {
                        return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * w + "," + d.cy * w;
                    }
                    return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx * w + "," + d.cy * w;
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

    drawLines(labels);
}

// draw party labels
function drawPartyLabels(data) {
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.mps.length;
        });

    var piedata = pie(data);

    var labels = svg.selectAll("text.label-party").data(piedata)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cx = Math.cos(a) * (radius * 2 - 73);
            return d.x = Math.cos(a) * (radius * 2 + 25);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cy = Math.sin(a) * (radius * 2 - 73);
            return d.y = Math.sin(a) * (radius * 2 + 25);
        })
        .attr('class', function(d) {
            return d.data.option + '-label-party'
        })
        .classed('label-party', true)
        .classed('label', true)
        .text(function(d) {
            return d.data.pg.acronym + ' | ' + d.data.mps.length;
        })
        .each(function(d) {
            var bbox = this.getBBox();
            d.sx = d.x - bbox.width / 2 - 2;
            d.ox = d.x + bbox.width / 2 + 2;
            d.sy = d.oy = d.y + 5;

            var w = 2.2;
            if (d.cx * w > d.sx && d.cy * w < d.sy && d.cx < 0) {
                d3.select(this).attr('x', function(d) {
                    return d.x - Math.abs(d.cx * w - d.sx)/3.5;
                });
            }
            if ((d.cx * w > d.sx) && (d.cy < d.sy) && (d.cx < d.ox - 8)) {
                console.log(d);
                d3.select(this).attr('x', function(d) {
                    return d.x + Math.abs(d.cx * w - d.sx);
                });
            }
        });

    var alpha = 0.5;
    var spacingY = 20;
    var spacingX = 40;

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

            });
        });

        if (again) {
            setTimeout(relax(labels), 20);
        } else {
        }

    }


    groupedData = groupBy(second_level_data, function(item) {
        return [item.option]
    });

    for (i in groupedData) {
        var group_of_labels = d3.selectAll('.' + groupedData[i][0]['option'] + '-label-party');
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

        svg.selectAll("path.pointer-party").data(piedata).enter()
            .append("path")
            .attr('class', function(d) {
                return d.data.option + '-pointer-party'
            })
            .classed('pointer', true)
            .classed('pointer-party', true)
            .style("fill", "none")
            .attr("d", function(d) {

                var w = 2.2;

                if (d.cx > d.ox - 8) { //|| Math.abs(d.cx) < 0.1) {
                    //if (d.cy < d.oy) {
                    //    console.log(d);
                    //    return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + (d.cx * w + 10) + "," + (d.cy * w + 10);
                    //}
                    return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * w + "," + d.cy * w;
                } else {
                    if ((d.endx > 0) && (Math.abs(d.cx) < 10)) {
                        return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx * w + "," + d.cy * w;
                    }
                    return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx * w + "," + d.cy * w;
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

    drawLines(labels);

}

// initial setup
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
    .on('click', function() {

        // hide option labels
        d3.selectAll('.label-option')
            .transition()
            .duration(300)
            .style('opacity', 0);
        d3.selectAll('.pointer-option')
            .transition()
            .duration(300)
            .style('opacity', 0);

        // hide mps
        d3.selectAll('.mpgroup')
            .classed('hidden', true);

        // translate currently active slices and hide labels of active elements
        // hide other party labels
        d3.selectAll('.label-party')
            .transition()
            .duration(300)
            .style('opacity', 0);
        d3.selectAll('.pointer-party')
            .transition()
            .duration(300)
            .style('opacity', 0);
        // demote currently chosen slices
        d3.selectAll('path.chosen')
            .classed('chosen', false)
            .transition()
            .duration(300)
            .attrTween('transform', function(d) {

                var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                var startTranslateState = 'translate(' + Math.cos(a) * (radius * 0.1) + ',' + Math.sin(a) * (radius * 0.1) + ')';
                var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                return d3.interpolateString(startTranslateState, endTranslateState);
            })
        // demote currently active slices
        d3.selectAll('path.active')
            .classed('active', false)
            .transition()
            .delay(300)
            .duration(300)
            .attrTween('transform', function(d) {

                var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                var endTranslateState = 'translate(' + Math.cos(a) * (radius * 0.05) + ',' + Math.sin(a) * (radius * 0.05) + ')';
                return d3.interpolateString( endTranslateState, 'translate(0, 0)');
            })

        // show labels
        d3.selectAll('.label-option')
            .transition()
            .duration(300)
            .style('opacity', 1);
        d3.selectAll('.pointer-option')
            .transition()
            .duration(300)
            .style('opacity', 1);
    })
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

var second_level_data = [];
for (option in data.all) {
    for (party in data.all[option]['breakdown']) {

        var newdict = data.all[option]['breakdown'][party];
        newdict.option = option;

        second_level_data.push(newdict);

    }
}

var option_data = [];
for (i in data.all) { 
    option_data.push(data.all[i]);
}

drawPie(second_level_data);
drawOptionLabels(option_data);
drawPartyLabels(second_level_data);



function moveSingleMP() {
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
}