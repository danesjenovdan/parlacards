(function() {

// TODO refactor opacity code -> single redraw function -> also needs updatePeopleScroller()
// tooltip start

// Define the div for the tooltip
var tooltipdiv = d3.select("#vocabulary-chart").append("div")
    .attr("class", "kompastooltip");

// tooltip end

function uniq(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
function uniqBy(a, key) {
    var seen = {};
    return a.filter(function(item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

function makeSwitchEvent(acronym) {
    console.log(acronym);
    $('#partyswitch-' + acronym).on('click', function() {
        var partymembers = d3.select('#kompasgroup' + $(this).data('acronym')).selectAll('.dot');

        if (!$(this).hasClass('turnedon')) { // !.turnedon
            partymembers.classed('selected', true);
            $('#vocabulary-chart').addClass('selection-active');

            $(this).addClass('turnedon');

            partymembers.each(function(d, i) {
                $('#personcard' + d.person.id).removeClass('hidden');
                updatePeopleScroller();
            });

        } else { // .turnedon
            partymembers.classed('selected', false);
            $(this).removeClass('turnedon');

            if ($('.dot.selected').length === 0) {
                $('#vocabulary-chart').removeClass('selection-active');
            }

            partymembers.each(function(d, i) {
                $('#personcard' + d.person.id).addClass('hidden');
                updatePeopleScroller();
            });
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
    .range([margin.left, width]).nice();

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

x.domain([xMin, xMax]);

var nodes = data.map(function(node, index) {
    return {
        person: node.person,
        score: node.score,
        idealradius: node.score / 100,
        radius: 15,
        // Set the node's gravitational centerpoint.
        idealcx: x(node.score),
        idealcy: height / 2,
        x: x(node.score),
        // Add some randomization to the placement;
        // nodes stacked on the same point can produce NaN errors.
        y: height / 2 + Math.random()
    };
});

var groupedNodes = groupBy(nodes, function(node) {
    return [node.person.party.acronym]
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
    .orient('top')
    .tickSize(380);

/**
 * On a tick, apply custom gravity, collision detection, and node placement.
 */
function tick(e) {
    for (i = 0; i < nodes.length; i++) {
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

    for (group in groupedNodes) {
        var currentselection = d3.select('#kompasgroup' + groupedNodes[group][0].person.party.acronym.replace(' ', '_'))
            .selectAll('.dot')
            .data(groupedNodes[group])
            .enter()
            .append("circle")
            .classed("dot", true)
            .attr('id', function(d) {
                return '_' + d.person.id;
            })
            .attr("r", function(d) {
                return d.radius;
            })
            .attr("transform", transform)
            .style("stroke", function(d) {
                return color(d.person.party.acronym.replace(' ', '_'));
            })
            .style('fill', function(d) {
                return 'url(#' + d.person.gov_id + ')'
            })
            .on('click', function(d) {
                exposeMe(d);
            })
            .on("mouseover", function(d) { // setup tooltip
                tooltipdiv.transition()
                    .duration(200)
                    .style("opacity", .9);

                console.log(d3.event.pageX, d3.event.pageY, d);

                tooltipdiv.html(d.person.name + ' | ' + d.score)
                    .style("left", (d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('#vocabulary-chart').offset().left + 10 + "px"))
                    .style("top", (d3.event.pageY - $('#vocabulary-chart').offset().top - 30) + "px");
                })
            .on("mouseout", function(d) {
                tooltipdiv.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        makeSwitchEvent(groupedNodes[group][0].person.party.acronym.replace(' ', '_'));
    }
}

var color = d3.scale.ordinal()
    .range(["#8FCFEE", "#4FB5E6", "#AA7375", "#534961", "#4F6379", "#5388AA", "#D9776B", "#BA594C"]);

var svg = d3.select("#vocabulary-chart")
    .append("svg")
    .attr('viewBox', '0 0 700 400')
    .attr('preserveAspectRatio', 'xMidYMid meet');

svg.append("g")
    .classed("x axis", true)
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

var objects = svg.append("svg")
    .classed("objects", true)
    .attr("width", width)
    .attr("height", height);

var partygroups = objects.selectAll('g')
    .data(groupedNodes)
    .enter()
    .append('g')
    .attr('id', function(d, i) {
        return 'kompasgroup' + d[0].person.party.acronym.replace(' ', '_');
    });

var defs = svg.append('defs').attr('id', 'thedefs');

for (i in nodes) {
    defs.append("pattern")
        .attr("id", nodes[i].person.gov_id)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", -15)
        .attr("y", -15)
        .append("image")
        .attr("xlink:href", 'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + data[i].person.gov_id + '.png')
        .attr("width", 30)
        .attr("height", 30)
        .attr("x", 0)
        .attr("y", 0);
}


function overGroup() {};

function offGroup() {};

function exposeMe(datum) {
    console.log(datum);
    if (!$('#vocabulary-chart').hasClass('selection-active')) {
        $('#vocabulary-chart').addClass('selection-active');
    }

    var clicked_element = d3.select('#_' + datum.person.id);
    if (!clicked_element.classed('selected')) {
        clicked_element.classed('selected', true);
        $('#personcard' + datum.person.id).removeClass('hidden');
    } else {
        clicked_element.classed('selected', false);
        $('#personcard' + datum.person.id).addClass('hidden');
    }

    if ($('.dot.selected').length === 0) {
        $('#vocabulary-chart').removeClass('selection-active');
    }

    updatePeopleScroller();
}

function exposeHer(datum) {
    console.log(datum);
    if (!$('#vocabulary-chart').hasClass('selection-active')) {
        $('#vocabulary-chart').addClass('selection-active');
    }

    var clicked_element = d3.select('#_' + datum.id);
    if (!clicked_element.classed('selected')) {
        clicked_element.classed('selected', true);
        $('#personcard' + datum.id).removeClass('hidden');
    } else {
        clicked_element.classed('selected', false);
        $('#personcard' + datum.id).addClass('hidden');
    }

    if ($('.dot.selected').length === 0) {
        $('#vocabulary-chart').removeClass('selection-active');
    }

    updatePeopleScroller();
}

window.setTimeout(function() {
    renderGraph();
}, 1000);

$.each($('.kompas-stranka'), function(i, e) {
    $(e).css('border-bottom', '10px solid ' + color($(e).data('acronym')));
});

function updatePeopleScroller() {
    var thewidth = 0;
    $('.kompas-people-wide').width(100000);
    $('.kompas-person').not('.hidden').each(function(i, e) {
        thewidth = thewidth + $(e).outerWidth() + 21;
    });
    $('.kompas-people-wide').width(thewidth);
}

function removeSearchPerson(name) {
    for (person_i in searchpeople) {
        if (searchpeople[person_i]['label'] == name) {
            console.log(name);
            searchpeople.splice(person_i, 1);
        }
    }
}

function addSearchPerson(name, id) {
    searchpeople.push({
        'label': name,
        'value': id
    });
}

$('.kompas-person').on('click', function() {
    $(this).addClass('hidden');

    var d3person = d3.select('#_' + $(this).data('id'));
    d3person.classed('selected', false);

    if ($('.dot.selected').length === 0) {
        $('#vocabulary-chart').removeClass('selection-active');
    }

    addSearchPerson(d3person.datum().person.name, d3person.datum().person.id);
});

$('.kompas-person').each(function(i, e) {
    $(e).children('.kompas-person-party').css('background-color', color($(e).data('acronym')));
});


var poslancisearch = new Bloodhound({
    'datumTokenizer': Bloodhound.tokenizers.obj.whitespace('name'),
    'queryTokenizer': Bloodhound.tokenizers.whitespace,
    'local': searchpeople
});

var skupinesearch = new Bloodhound({
    'datumTokenizer': Bloodhound.tokenizers.obj.whitespace('acronym', 'name'),
    'queryTokenizer': Bloodhound.tokenizers.whitespace,
    'local': parties_data
});

function updatePeopleSearch() {
    poeplesearchtypeahead = $('.kompas-search-input').typeahead({

    }, {
        // 'limit': 3,
        'name': 'poslanci',
        'display': 'name',
        'source': poslancisearch,
        'templates': {
            'empty': '<div class="searchheader">Med poslanci ni zadetkov</div>',
            'suggestion': function(datum) {
                return '<div class="searchperson-container"><div class="avgminimg img-circle" style="width: 40px; height: 40px; background-image: url(\'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + datum.gov_id + '.png\'); background-size: cover;"></div>' + datum.name + '</div>'
            },
            'header': '<div class="searchheader">POSLANKE IN POSLANCI</div>'
        }
    }, {
        // 'limit': 3,
        'name': 'skupine',
        'display': 'acronym',
        'source': skupinesearch,
        'templates': {
            'empty': '<div class="searchheader">Med PS ni zadetkov</div>',
            'suggestion': function(datum) {
                return '<div class="searchperson-container"><div class="avgminimg avgminimg-party img-circle" style="width: 40px; height: 40px;"></div>' + datum.acronym + '</div>'
            },
            'header': '<div class="searchheader results">POSLANSKE SKUPINE</div>'
        }
    });

    $('.kompas-search-input').bind('typeahead:select', function(e, datum) {

        if (datum.acronym) {
            $('#partyswitch-' + datum.acronym.replace(' ', '_')).click();
        } else {

            exposeHer(datum);
            removeSearchPerson(datum);
        }

        $('.kompas-search-input').typeahead('close').typeahead('val', '');
    });
}

updatePeopleSearch();

function removeSearchPerson(datum) {
    for (person_i in searchpeople) {
        if (searchpeople[person_i]['name'] == datum.name) {
            console.log(name);
            searchpeople.splice(person_i, 1);
        }
    }

    poslancisearch.local = searchpeople;
    poslancisearch.initialize(true);
}

function addSearchPerson(datum) {
    searchpeople.push(datum);
    poslancisearch.local = searchpeople;
    poslancisearch.initialize(true);
}
})();