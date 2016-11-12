// (function() {

function makeSwitchEvent2(selection) {
    $('#partyswitch-' + d3.select(selection[0][0]).datum().person.party.acronym.replace(/ /g, '_')).on('click', function() {
        if (!$(this).hasClass('turnedon')) {

            $(this).addClass(d3.select(selection[0][0]).datum().person.party.acronym.replace(/ /g, '_').toLowerCase() + '-background');

            for (var i = 0; i < selection[0].length; i++) {
                // show photos
                showPersonPicture(d3.select(selection[0][i]).datum())

                // move to front
                var parent = $('#_' + d3.select(selection[0][i]).datum().person.id).parent()[0];
                moveToFront(parent, d3.select(selection[0][i]).datum());
            }
            console.log(Math.floor(selection[0].length / 2));
            centerCompass();
        } else {
            $(this).removeClass(d3.select(selection[0][0]).datum().person.party.acronym.replace(/ /g, '_').toLowerCase() + '-background');

            for (var i = 0; i < selection[0].length; i++) {
                d3.select('#personcard' + d3.select(selection[0][i]).datum().person.id).classed('hidden', true);
                d3.select(selection[0][i])
                    .attr('r', function(d) {
                        return 3;
                    })
                    // .style("fill", function(d) {
                    //     return color(d.person.party.acronym.replace(/ /g, '_'));
                    // })
                    // .classed(d3.select(selection[0][i]).datum().person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
                    .style('fill', null)
                    .on('click', function(d) {
                        // show photo
                        showPersonPicture(d);

                        // move to front
                        var parent = $('#_' + d.person.id).parent()[0];
                        moveToFront(parent, d);
                    });
            }
        }
        $(this).toggleClass('turnedon');
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
    parties.push(groupedData[group][0].person.party.acronym.replace(/ /g, '_'));
}

var color = d3.scale.ordinal()
    .range(["#8FCFEE", "#4FB5E6", "#AA7375", "#534961", "#4F6379", "#5388AA", "#D9776B", "#BA594C"]);

var zoomBeh = d3.behavior.zoom()
    .x(x)
    .y(y)
    .scaleExtent([0.6, 10])
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
        return 'kompasgroup' + d[0].person.party.acronym.replace(/ /g, '_');
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
        .attr("xlink:href", 'https://cdn.parlameter.si/v1/parlassets/img/people/square/' + kompas_data[i].person.gov_id + '.png')
        .attr("width", 40)
        .attr("height", 40)
        .attr("x", 0)
        .attr("y", 0);
}

// tooltip start

// Define the div for the tooltip
var tooltipdiv = d3.select("#kompas-scatter").append("div")
    .attr("class", "kompastooltip");

// tooltip end

for (group in groupedData) {

    var currentselection = d3.select('#kompasgroup' + groupedData[group][0].person.party.acronym.replace(/ /g, '_')).classed('partygroup', true)
        .selectAll('.dot')
        .data(groupedData[group])
        .enter()
        .append("circle")
        .classed("dot", true)
        .attr('id', function(d) {
            return '_' + d.person.id;
        })
        .attr("r", function(d) {
            return 3;
        })
        .attr("transform", transform)
        // .style('border', '3px solid')
        // .style("fill", function(d) {
        //     return color(d.person.party.acronym.replace(/ /g, '_'));
        // })
        .classed(groupedData[group][0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
        .classed(groupedData[group][0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
        // .style("stroke", function(d) {
        //     return color(d.person.party.acronym.replace(/ /g, '_'));
        // })
        // .style('fill', function(d) {
        //     return 'url(#' + d.person.gov_id + ')'
        // })
        .on('click', function(d, i) {
            // var element = d3.select('#_' + d.person.id);
            // if (element.classed('selected')) {
            //     removeSingleHull(d);
            //     element.classed('selected', false);
            // } else {

            // show photo
            showPersonPicture(d);

            // move to front
            var parent = $('#_' + d.person.id).parent()[0];
            moveToFront(parent, d);

            //     element.classed('selected', true);
            // }
        })
        .on("mouseover", function(d) { // setup tooltip
            tooltipdiv.transition()
                .duration(200)
                .style("opacity", .9);

            // console.log($(this).parents('#kompas-scatter')));
            tooltipdiv.html(d.person.name)
                .style("left", (d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('#kompas-scatter').offset().left + 10 + "px"))
                .style("top", (d3.event.pageY - $('#kompas-scatter').offset().top - 30) + "px");
            })
        .on("mouseout", function(d) {
            tooltipdiv.transition()
                .duration(200)
                .style("opacity", 0);
        });
    // .style('filter', 'url(#glow)');
    // .on('mouseover', overGroup)
    // .off('mouseover', offGroup);

    // drawHull(currentselection, groupedData[group]);
    makeSwitchEvent2(currentselection); // TODO

}

function zoom(animate) {

    console.log('ping');

    if (animate) {
        svg.selectAll(".dot")
            .transition()
            .duration(400)
            .attr("transform", transform);
    } else {
        svg.selectAll(".dot")
            .attr("transform", transform);
    }

    // svg.selectAll(".singlehull")
    //     .attr("d", function(d) {
    //         var parent = d3.select('#' + d3.select(this).attr('data-parent'));
    //         var translateX = parseInt(parent.attr('transform').split('(')[1].split(',')[0]);
    //         var translateY = parseInt(parent.attr('transform').split('(')[1].split(',')[1].split(')')[0]);
    //         console.log(translateX, translateY)
    //         return "M" + translateX + ',' + translateY + "L" + (translateX + 0.01) + ',' + translateY + "Z";
    //     });

    // for (group in groupedData) {
    //
    //     var currentselection = d3.select('#kompasgroup' + groupedData[group][0].person.party.acronym.replace(/ /g, '_'))
    //
    //     redrawHull(currentselection, groupedData[group]);
    //
    // }
}

function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
}

function overGroup() {};

function offGroup() {};

function drawSingleHull(datum) {

    // display card
    $('#personcard' + datum.person.id).removeClass('hidden').detach().prependTo('.kompas-people-wide');
    updatePeopleScroller();

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
        // .style('fill', function(d) {
        //     return color(datum.person.party.acronym.replace(/ /g, '_'));
        // })
        .classed(datum.person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
        .classed(datum.person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
        // .style('stroke', function(d) {
        //     return color(datum.person.party.acronym.replace(/ /g, '_'));
        // })
        .on('click', function() {
            d3.select('#personcard' + d3.select(this).attr('data-id')).classed('hidden', true);
            d3.select(this).remove();
        });
}

function moveToFront(parent, selected) {
    // move person to group front
    d3.select(parent).selectAll('.dot')
        .sort(function(a, b) {
            s = selected.person.id;
            return (a.person.id == s) - (b.person.id == s);
        });

    // move group in front of other groups
    d3.select(parent.parentNode).selectAll('.partygroup')
        .sort(function(a, b) {
            s = selected.person.party.id;
            return (a[0].person.party.id == s) - (b[0].person.party.id == s);
        });
}

function showPersonPicture(datum) {

    // display card
    $('#personcard' + datum.person.id).removeClass('hidden').detach().prependTo('.kompas-people-wide');
    updatePeopleScroller();

    // create hull
    d3.select('#_' + datum.person.id)
        .attr('r', function(d) {
            return 20;
        })
        .style('fill', function(d) {
            return 'url(#' + d.person.gov_id + ')'
        })
        .classed('turnedon', true)
        .on('click', function() {
            d3.select('#personcard' + d3.select(this).datum().person.id).classed('hidden', true);
            d3.select(this)
                .attr('r', function(d) {
                    return 3;
                })
                // .style("fill", function(d) {
                //     return color(d.person.party.acronym.replace(/ /g, '_'));
                // })
                .classed(d3.select(this).datum().person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
                .style('fill', null)
                .classed('turnedon', false)
                .on('click', function(d) {
                    // show photo
                    showPersonPicture(d);

                    // move to front
                    var parent = $('#_' + d.person.id).parent()[0];
                    moveToFront(parent, d);
                });

            // if all party members are hidden, disable partyswitch
            var partyacronym = datum.person.party.acronym.replace(/ /g, '_');

            if ($(d3.select('#kompasgroup' + partyacronym)[0]).children('.turnedon').length === 0) {
                $('#partyswitch-' + partyacronym)
                    .removeClass('turnedon')
            }

        });
}

function centerCompass() {

    // translate points to [0, 0]
    zoomBeh.scale([0.8]);
    zoomBeh.translate([50, 50]);
    zoom(true);
}

function zoomIn(datum, scale) {
    var point = d3.select('#_' + datum.person.id);

    // translate points to [0, 0]
    zoomBeh.scale([scale]);
    zoomBeh.translate([0, 0]);

    var parentBounds = svg.node().getBoundingClientRect();
    var stretchCoef = {
        'x': 700/parentBounds.width,
        'y': 400/parentBounds.height
    };
    var newx = (parentBounds.width / 2 * stretchCoef.x - x(datum[xCat]));
    var newy = (parentBounds.height / 2  * stretchCoef.y - y(datum[yCat]));
    zoomBeh.translate([newx, newy]);
    zoom(true);
}

function drawHull(group, dataset) {
    var hull = objects.append("path")
        .attr("class", "hull")
        .attr('id', function() {
            return 'kompashull' + dataset[0].person.party.acronym.replace(/ /g, '_');
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
            // .style('fill', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // })
            // .style('stroke', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // });
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
    } else if (vertices.length === 2) {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            // .style('fill', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // })
            // .style('stroke', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // });
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
    } else {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d[0][0] + ',' + d[0][1] + "L" + (d[0][0] + 0.1) + ',' + d[0][1] + "Z";
            })
            // .style('fill', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // })
            // .style('stroke', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // });
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
    }

    makeSwitchEvent(dataset[0].person.party.acronym.replace(/ /g, '_'));
}

function redrawHull(group, dataset) {
    var hull = objects.select("#kompashull" + dataset[0].person.party.acronym.replace(/ /g, '_'));

    var vertices = dataset.map(function(d) {
        return [x(d[xCat]), y(d[yCat])];
    });

    if (vertices.length > 2) {
        hull.datum(d3.geom.hull(vertices))
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            // .style('fill', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // })
            // .style('stroke', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // });
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
    } else if (vertices.length === 2) {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d.join("L") + "Z";
            })
            // .style('fill', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // })
            // .style('stroke', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // });
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
    } else {
        hull.datum(vertices)
            .attr("d", function(d) {
                return "M" + d[0][0] + ',' + d[0][1] + "L" + (d[0][0] + 0.01) + ',' + d[0][1] + "Z";
            })
            // .style('fill', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // })
            // .style('stroke', function(d) {
            //     return color(dataset[0].person.party.acronym.replace(/ /g, '_'));
            // });
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-fill', true)
            .classed(dataset[0].person.party.acronym.replace(/ /g, '_').toLowerCase() + '-stroke', true)
    }
}

$.each($('.kompas-stranka'), function(i, e) {
    $(e).css('border-bottom', '10px solid ' + color($(e).data('acronym')));
});

function updatePeopleScroller() {
    var thewidth = 0;
    $('.kompas-people-wide').width(100000);
    $('.kompas-person').not('.hidden').each(function(i, e) {
        thewidth = thewidth + $(e).outerWidth() + 21;
    });
    // console.log(thewidth);
    $('.kompas-people-wide').width(thewidth);
}

$('.kompas-person-close').on('click', function(e) {
    e.stopPropagation();
    $(this).parent().addClass('hidden');

    // turn picture back to dot
    d3.select('#_' + $(this).data('id'))
        .attr('r', function(d) {
            return 3;
        })
        // .style("fill", function(d) {
        //     return color(d.person.party.acronym.replace(/ /g, '_'));
        // })
        .style('fill', null)
        .classed('turnedon', false)
        .on('click', function(d) {
            // show photo
            showPersonPicture(d);

            // move to front
            var parent = $('#_' + d.person.id).parent()[0];
            moveToFront(parent, d);
        });

    // handle search
    var persondata = d3.select('#_' + $(this).data('id')).datum()
    addSearchPerson(persondata.person);

    // if all party members are hidden, disable partyswitch
    var partyacronym = d3.select('#_' + $(this).data('id')).datum().person.party.acronym.replace(/ /g, '_');

    if ($(d3.select('#kompasgroup' + partyacronym)[0]).children('.turnedon').length === 0) {
        $('#partyswitch-' + partyacronym)
            .removeClass('turnedon')
    }
});
$('.kompas-person').on('click', function() {
    document.location.href = 'https://skoraj.parlameter.si/p/id/' + $(this).data('id');

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
        'hint': false,
        'highlight': true
    }, {
        // 'limit': 3,
        'name': 'poslanci',
        'display': 'name',
        'source': poslancisearch,
        'templates': {
            'empty': '<div class="searchheader results">POSLANKE IN POSLANCI</div><div class="searchperson-container">Ni zadetkov.</div>',
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
            'empty': '<div class="searchheader results">POSLANSKE SKUPINE</div><div class="searchperson-container">Ni zadetkov.</div>',
            'suggestion': function(datum) {
                return '<div class="searchperson-container"><div class="avgminimg avgminimg-party img-circle ' + datum.acronym.replace(/ /g, '_').toLowerCase() + '-background" style="width: 40px; height: 40px;"></div>' + datum.acronym + '</div>'
            },
            'header': '<div class="searchheader results">POSLANSKE SKUPINE</div>'
        }
    });

    $('.kompas-search-input').bind('typeahead:select', function(e, datum) {

        if (datum.acronym) {
            $('#partyswitch-' + datum.acronym.replace(/ /g, '_')).click();
        } else {

            // show photos
            showPersonPicture(d3.select('#_' + datum.id).datum());

            // move to front
            var parent = $('#_' + d3.select('#_' + datum.id).datum().person.id).parent()[0];
            moveToFront(parent, d3.select('#_' + datum.id).datum());

            // remove from autocomplete
            removeSearchPerson(datum);

            // zoom in
            zoomIn(d3.select('#_' + datum.id).datum(), 4);
        }

        $('.kompas-search-input').typeahead('close').typeahead('val', '');
    });
}

updatePeopleSearch();

function removeSearchPerson(datum) {
    for (person_i in searchpeople) {
        if (searchpeople[person_i]['name'] == datum.name) {
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
// })();
