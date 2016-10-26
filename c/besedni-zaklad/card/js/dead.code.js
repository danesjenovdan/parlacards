function DEADdrawSingleHull(datum) {

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

function DEADdrawHull(group, dataset) {
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

function DEADredrawHull(group, dataset) {
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