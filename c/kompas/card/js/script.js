function makeSwitchEvent(acronym) {
    $('#partyswitch-' + acronym).on('click', function() {
        $(this).toggleClass('turnedon');
        if (d3.select('#kompashull' + acronym).classed('hidden')) {
            d3.select('#kompashull' + acronym).classed('hidden', false);
        } else {
            d3.select('#kompashull' + acronym).classed('hidden', true);
        }
    });
}

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

var groupedData = groupBy(kompas_data, function(item) {
    return [item.person.party.acronym]
});

var margin = {
        top: 50,
        right: 300,
        bottom: 50,
        left: 50
    },
    outerWidth = 1050,
    outerHeight = 500,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "ideology1";
var yCat = "ideology2";

kompas_data.forEach(function(d) {
    d.ideology1 = +d.score.vT1;
    d.ideology2 = +d.score.vT2;
});

var xMax = d3.max(kompas_data, function(d) {
        return d[xCat];
    }) * 1.05,
    xMin = d3.min(kompas_data, function(d) {
        return d[xCat];
    }),
    xMin = xMin > 0 ? 0 : xMin,
    yMax = d3.max(kompas_data, function(d) {
        return d[yCat];
    }) * 1.05,
    yMin = d3.min(kompas_data, function(d) {
        return d[yCat];
    }),
    yMin = yMin > 0 ? 0 : yMin;

x.domain([xMin, xMax]);
y.domain([yMin, yMax]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickSize(0);

var parties = [];
for (group in groupedData) {
    parties.push(groupedData[group][0].person.party.acronym.replace(' ', '_'));
}

var color = d3.scale.ordinal()
    .range(["#8FCFEE", "#4FB5E6", "#AA7375", "#534961", "#4F6379", "#5388AA", "#D9776B", "#BA594C"]);

var zoomBeh = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([0, 500])
    .on("zoom", zoom);

var svg = d3.select("#kompas-scatter")
    .append("svg")
    .attr('viewBox', '0 0 700 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append("g")
    .call(zoomBeh);

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

svg.append("g")
    .classed("y axis", true)
    .call(yAxis)

svg.selectAll(".tick")
    .each(function(d, i) {
        this.remove();
    });

var objects = svg.append("svg")
    .classed("objects", true)
    .attr("width", width)
    .attr("height", height);

var parties = objects.selectAll('g')
    .data(groupedData)
    .enter()
    .append('g')
    .attr('id', function(d, i) {
        return 'kompasgroup' + d[0].person.party.acronym.replace(' ', '_');
    });

var defs = svg.append('defs');

for (i in kompas_data) {
    defs.append("pattern")
        .attr("id", kompas_data[i].person.gov_id)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", -20)
        .attr("y", 20)
        .append("image")
        .attr("xlink:href", 'https://cdn.parlameter.si/v1/img/people/' + kompas_data[i].person.gov_id + '.png')
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", 0)
        .attr("y", 0);
}

for (group in groupedData) {

    var currentselection = d3.select('#kompasgroup' + groupedData[group][0].person.party.acronym.replace(' ', '_'))
        .selectAll('.dot')
        .data(groupedData[group])
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr('id', function(d) {
            return '_' + d.person.id;
        })
        .attr("r", function(d) {
            return 20;
        })
        .attr("transform", transform)
        // .style('border', '3px solid')
        .style("stroke", function(d) {
            return color(d.person.party.acronym.replace(' ', '_'));
        })
        .style('fill', function(d) {
            return 'url(#' + d.person.gov_id + ')'
        })
        .on('click', function(d, i) {
            // var element = d3.select('#_' + d.person.id);
            // if (element.classed('selected')) {
            //     removeSingleHull(d);
            //     element.classed('selected', false);
            // } else {
            drawSingleHull(d);
            //     element.classed('selected', true);
            // }
        });
    // .style('filter', 'url(#glow)');
    // .on('mouseover', overGroup)
    // .off('mouseover', offGroup);

    drawHull(currentselection, groupedData[group]);

}

function zoom() {

    svg.selectAll(".dot")
        .attr("transform", transform);

    svg.selectAll(".singlehull")
        .attr("d", function(d) {
            var parent = d3.select('#' + d3.select(this).attr('data-parent'));
            var translateX = parseInt(parent.attr('transform').split('(')[1].split(',')[0]);
            var translateY = parseInt(parent.attr('transform').split('(')[1].split(',')[1].split(')')[0]);
            console.log(translateX, translateY)
            return "M" + translateX + ',' + translateY + "L" + (translateX + 0.01) + ',' + translateY + "Z";
        });

    for (group in groupedData) {

        var currentselection = d3.select('#kompasgroup' + groupedData[group][0].person.party.acronym.replace(' ', '_'))

        redrawHull(currentselection, groupedData[group]);

    }
}

function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
}

function overGroup() {};

function offGroup() {};

function drawSingleHull(datum) {

    // create card
    $('.kompas-people').append('<div class="kompas-person" id="personcard' + datum.person.id + '" data-id="' + datum.person.id + '">' + datum.person.name + '</div>');
    $('#personcard' + datum.person.id).on('click', function() {
        $('#singlehull' + $(this).data('id')).remove();
        $(this).remove();
    });

    // create hull
    var hull = objects.append('path')
        .classed('hull', true)
        .classed('singlehull', true)
        .attr('data-parent', '_' + datum.person.id)
        .attr('id', function() {
            return 'singlehull' + datum.person.id;
        })
        .attr('data-id', datum.person.id);

    var vertices = [
        [x(datum[xCat]), y(datum[yCat])]
    ];

    hull.datum(vertices)
        .attr("d", function(d) {
            return "M" + d[0][0] + ',' + d[0][1] + "L" + (d[0][0] + 0.1) + ',' + d[0][1] + "Z";
        })
        .style('fill', function(d) {
            return color(datum.person.party.acronym.replace(' ', '_'));
        })
        .style('stroke', function(d) {
            return color(datum.person.party.acronym.replace(' ', '_'));
        })
        .on('click', function() {
            d3.select('#personcard' + d3.select(this).attr('data-id')).remove();
            d3.select(this).remove();
        });
}

function drawHull(group, dataset) {
    var hull = objects.append("path")
        .attr("class", "hull")
        .attr('id', function() {
            return 'kompashull' + dataset[0].person.party.acronym.replace(' ', '_');
        })
        .classed('hidden', true);

    var vertices = dataset.map(function(d) {
        return [x(d[xCat]), y(d[yCat])];
    });

    if (vertices.length > 2) {
        hull.datum(d3.geom.hull(vertices))
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    } else if (vertices.length === 2) {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    } else {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d[0][0] + ',' + d[0][1] + "L" + (d[0][0] + 0.1) + ',' + d[0][1] + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    }

    makeSwitchEvent(dataset[0].person.party.acronym.replace(' ', '_'));
}

function redrawHull(group, dataset) {
    var hull = objects.select("#kompashull" + dataset[0].person.party.acronym.replace(' ', '_'));

    var vertices = dataset.map(function(d) {
        return [x(d[xCat]), y(d[yCat])];
    });

    if (vertices.length > 2) {
        hull.datum(d3.geom.hull(vertices))
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    } else if (vertices.length === 2) {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    } else {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d[0][0] + ',' + d[0][1] + "L" + (d[0][0] + 0.01) + ',' + d[0][1] + "Z";
            })
            .style('fill', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            })
            .style('stroke', function(d) {
                return color(dataset[0].person.party.acronym.replace(' ', '_'));
            });
    }
}
