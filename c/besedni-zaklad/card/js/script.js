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

var groupedData = groupBy(data, function(item) {
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

// var x = d3.scale.linear()
//     .range([0, width]).nice();

var x = d3.scale.linear()
  .range( [margin.left, width ] ).nice();

var xCat = "score";

data.forEach(function(d) {
    d.score = +d.score;
});

var xMax = d3.max(data, function(d) {
        return d[xCat];
    }) * 1.05;
var xMin = d3.min(data, function(d) {
        return d[xCat];
    });
var xMin = xMin > 0 ? 0 : xMin;

x.domain([xMin, xMax]);

var nodes = data.map(function(node, index) {
    return {
        person: node.person,
        score: node.score,
        idealradius: node.score / 100,
        radius: 15,
        // Give each node a random color.
        color: '#ff7f0e',
        // Set the node's gravitational centerpoint.
        idealcx: x(node.score),
        idealcy: height / 2,
        x: x(node.score),
        // Add some randomization to the placement;
        // nodes stacked on the same point can produce NaN errors.
        y: height / 2 + Math.random()
    };
});

var force = d3.layout.force()
  .nodes(nodes)
  .size([width, height])
  .gravity(0)
  .charge(0)
  .on("tick", tick)
  .start();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(0);

/**
 * On a tick, apply custom gravity, collision detection, and node placement.
 */
function tick(e) {
  for ( i = 0; i < nodes.length; i++ ) {
    var node = nodes[i];
    /*
     * Animate the radius via the tick.
     *
     * Typically this would be performed as a transition on the SVG element itself,
     * but since this is a static force layout, we must perform it on the node.
     */
    // node.radius = node.idealradius - node.idealradius * e.alpha * 10;
    node = gravity(.2 * e.alpha)(node);
    node = collide(.5)(node);
    node.cx = node.x;
    node.cy = node.y;
  }
}

/**
 * On a tick, move the node towards its desired position,
 * with a preference for accuracy of the node's x-axis placement
 * over smoothness of the clustering, which would produce inaccurate data presentation.
 */
function gravity(alpha) {
  return function(d) {
    d.y += (d.idealcy - d.y) * alpha;
    d.x += (d.idealcx - d.x) * alpha * 3;
    return d;
  };
}

/**
 * On a tick, resolve collisions between nodes.
 */
 var maxRadius = 15;
 var padding = 5;
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + padding,
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + padding;
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
    return d;
  };
}

function transform(d) {
    return "translate(" + d.x + "," + d.y + ")";
}

/**
 * Run the force layout to compute where each node should be placed,
 * then replace the loading text with the graph.
 */
function renderGraph() {
  // Run the layout a fixed number of times.
  // The ideal number of times scales with graph complexity.
  // Of course, don't run too long—you'll hang the page!
  force.start();
  for (var i = 50; i > 0; --i) force.tick();
  force.stop();

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + ( margin.top + ( height * 3/4 ) ) + ")")
    .call(xAxis);

  var circle = svg.selectAll('.dot')
    .data(nodes)
    .enter().append('g')
    .append("circle")
    // .enter().append('svg:image')
    //     .attr('xlink:href', function(d) {
    //         return 'https://cdn.parlameter.si/v1/img/people/' + d.person.gov_id + '.png';
    //     })
    //     .attr('x', function(d) { return d.x })
    //     .attr('y', function(d) { return d.y })
    //     .attr('height', 30)
    //     .attr('width', 30)
    // .style("fill", function(d) { return d.color; })
    // .attr("cx", function(d) { return d.x} )
    // .attr("cy", function(d) { console.log(d); return d.y} )
    .attr('transform', transform)
    .attr("r", function(d) { return d.radius} )
    .classed("dot", true)
    .attr('id', function(d) {
        return '_' + d.person.id;
    })
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
}

var parties = [];
for (group in groupedData) {
    parties.push(groupedData[group][0].person.party.acronym.replace(' ', '_'));
}

var color = d3.scale.ordinal()
    .range(["#8FCFEE", "#4FB5E6", "#AA7375", "#534961", "#4F6379", "#5388AA", "#D9776B", "#BA594C"]);

var svg = d3.select("#vocabulary-chart")
    .append("svg")
    .attr('viewBox', '0 0 700 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append("g");

svg.append("rect")
    .attr("width", width)
    .attr("height", height);

svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

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

var defs = svg.append('defs').attr('id', 'thedefs');

for (i in data) {
    defs.append("pattern")
        .attr("id", data[i].person.gov_id)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", -15)
        .attr("y", -15)
        .append("image")
        .attr("xlink:href", 'https://cdn.parlameter.si/v1/img/people/' + data[i].person.gov_id + '.png')
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", 0)
        .attr("y", 0);
}

// for (group in groupedData) {
//
//     var currentselection = d3.select('#kompasgroup' + groupedData[group][0].person.party.acronym.replace(' ', '_'))
//         .selectAll('.dot')
//         .data(groupedData[group])
//         .enter()
//         .append("circle")
//         .classed("dot", true)
//         .attr('id', function(d) {
//             return '_' + d.person.id;
//         })
//         .attr("r", function(d) {
//             return 20;
//         })
//         .attr("transform", transform)
//         // .style('border', '3px solid')
//         .style("stroke", function(d) {
//             return color(d.person.party.acronym.replace(' ', '_'));
//         })
//         .style('fill', function(d) {
//             return 'url(#' + d.person.gov_id + ')'
//         })
//         .on('click', function(d, i) {
//             // var element = d3.select('#_' + d.person.id);
//             // if (element.classed('selected')) {
//             //     removeSingleHull(d);
//             //     element.classed('selected', false);
//             // } else {
//             drawSingleHull(d);
//             //     element.classed('selected', true);
//             // }
//         });
//     // .style('filter', 'url(#glow)');
//     // .on('mouseover', overGroup)
//     // .off('mouseover', offGroup);
//
//     drawHull(currentselection, groupedData[group]);
//
// }


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

renderGraph();
