/* global Ps */



//doIt();

/**
 * Your code below
 * @type {{init: Function}}
 */

var data = [{
    'option': 'za',
    'total_votes': 10,
    'breakdown': [{
        'acronym': 'SMC',
        'party_id': 1,
        'total_votes': 6,
        'mps': [{
            'name': 'Janez Novak',
            'person_id': 12
        }, {
            'name': 'Đoni Novaković',
            'person_id': 21
        }, {
            'name': 'Janez Najboljši',
            'person_id': 9
        }, {
            'name': 'Đoni asdLsdj',
            'person_id': 44
        }, {
            'name': 'Janez Psodlje',
            'person_id': 54
        }, {
            'name': 'Đoni Jković',
            'person_id': 32
        }]
    }, {
        'acronym': 'SDS',
        'party_id': 2,
        'total_votes': 4,
        'mps': [{
            'name': 'Janez Novak',
            'person_id': 12
        }, {
            'name': 'Đoni Novaković',
            'person_id': 21
        }, {
            'name': 'Janez Najboljši',
            'person_id': 9
        }, {
            'name': 'Đoni asdLsdj',
            'person_id': 44
        }]
    }]
}, {
    'option': 'proti',
    'total_votes': 8,
    'breakdown': [{
        'acronym': 'SMC',
        'party_id': 1,
        'total_votes': 4,
        'mps': [{
            'name': 'Janez Najboljši',
            'person_id': 9
        }, {
            'name': 'Đoni asdLsdj',
            'person_id': 44
        }, {
            'name': 'Janez Psodlje',
            'person_id': 54
        }, {
            'name': 'Đoni Jković',
            'person_id': 32
        }]
    }, {
        'acronym': 'NSi',
        'party_id': 4,
        'total_votes': 4,
        'mps': [{
            'name': 'Janez Novak',
            'person_id': 12
        }, {
            'name': 'Đoni Novaković',
            'person_id': 21
        }, {
            'name': 'Janez Najboljši',
            'person_id': 9
        }, {
            'name': 'Đoni asdLsdj',
            'person_id': 44
        }]
    }]
}, {
    'option': 'kvorum',
    'total_votes': 8,
    'breakdown': [{
        'acronym': 'SMC',
        'party_id': 1,
        'total_votes': 4,
        'mps': [{
            'name': 'Janez Najboljši',
            'person_id': 9
        }, {
            'name': 'Đoni asdLsdj',
            'person_id': 44
        }, {
            'name': 'Janez Psodlje',
            'person_id': 54
        }, {
            'name': 'Đoni Jković',
            'person_id': 32
        }]
    }, {
        'acronym': 'NSi',
        'party_id': 4,
        'total_votes': 4,
        'mps': [{
            'name': 'Janez Novak',
            'person_id': 12
        }, {
            'name': 'Đoni Novaković',
            'person_id': 21
        }, {
            'name': 'Janez Najboljši',
            'person_id': 9
        }, {
            'name': 'Đoni asdLsdj',
            'person_id': 44
        }]
    }]
}, {
    'option': 'ni',
    'total_votes': 12,
    'breakdown': [{
        'acronym': 'ZL',
        'party_id': 1,
        'total_votes': 8,
        'mps': [{
            'name': 'Janez Najboljši',
            'person_id': 9
        }, {
            'name': 'Đoni asdLsdj',
            'person_id': 44
        }, {
            'name': 'Janez Psodlje',
            'person_id': 54
        }, {
            'name': 'Đoni Jković',
            'person_id': 32
        }, {
            'name': 'Janez Najboljš11234123432i',
            'person_id': 91
        }, {
            'name': 'Đoni asdLs11123dj',
            'person_id': 441
        }, {
            'name': 'Janez Psod1111lje',
            'person_id': 541
        }, {
            'name': 'Đoni Jk111ović',
            'person_id': 321
        }]
    }, {
        'acronym': 'SD',
        'party_id': 4,
        'total_votes': 4,
        'mps': [{
            'name': 'Janez Novak',
            'person_id': 12
        }, {
            'name': 'Đoni Novaković',
            'person_id': 21
        }, {
            'name': 'Janez Najboljši',
            'person_id': 9
        }, {
            'name': 'Đoni asdLsdj',
            'person_id': 44
        }]
    }]
}]

function drawInner(data) {

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(0);


    var labelArc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius);


    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.total_votes;
        });

    var piedata = pie(data);

    var g = svg.selectAll('.arc')
        .data(piedata)
        .enter()
        .append('g')
        .attr('class', 'arc');

    g.append('path')
        .attr('d', arc)
        .style('fill', function(d) {
            return color(d.data.option);
        })
        .attr("d", arc).style('stroke', 'white')
        .style('stroke-width', 2);

}

function drawOuter(data) {
    var arc = d3.svg.arc()
        .outerRadius(radius * 1.5 - 10)
        .innerRadius(radius);


    var labelArc = d3.svg.arc()
        .outerRadius(radius * 1.5 - 50)
        .innerRadius(radius * 1.5 - 100);


    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.total_votes;
        });

    var piedata = pie(data);

    var g = svg.selectAll('.arc2')
        .data(piedata)
        .enter()
        .append('g')
        .attr('class', 'arc2');

    g.append('path')
        .attr('d', arc)
        .style('fill', function(d) {
            return color(d.data.option);
        })
        .attr("d", arc).style('stroke', 'white')
        .style('stroke-width', 2);

    var labels = svg.selectAll("text").data(piedata)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cx = Math.cos(a) * (radius * 1.5 - 75);
            return d.x = Math.cos(a) * (radius * 1.5 + 20);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cy = Math.sin(a) * (radius * 1.5 - 75);
            return d.y = Math.sin(a) * (radius * 1.5 + 20);
        })
        .text(function(d) {
            return d.data.acronym + ' ' + String(d.data.total_votes);
        })
        .each(function(d) {
            var bbox = this.getBBox();
            d.sx = d.x - bbox.width / 2 - 2;
            d.ox = d.x + bbox.width / 2 + 2;
            d.sy = d.oy = d.y + 5;
        });


    svg.append("defs").append("marker")
        .attr("id", "circ")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("refX", 3)
        .attr("refY", 3)
        // .append("circle")
        // .attr("cx", 3)
        // .attr("cy", 3)
        // .attr("r", 3);

    svg.selectAll("path.pointer").data(piedata).enter()
        .append("path")
        .attr("class", "pointer")
        .style("fill", "none")
        .style("stroke", "black")
        .attr("marker-end", "url(#circ)")
        .attr("d", function(d) {
            if (d.cx > d.ox) {
                return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx*1.9 + "," + d.cy*1.9;
            } else {
                return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx*1.9 + "," + d.cy*1.9;
            }
        });
}
var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};
var width = 400 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var radius = Math.min(width, height) / 3;

var color = d3.scale.ordinal()
    .range(["#009CDD", "#00628C", "#99E1FF", "#003B54"]);

var svg = d3.select(".partychart").append("svg")
    .attr('viewBox', '0 0 400 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

$(document).ready(function() {
    // var linechart_data = data['facet_counts']['facet_dates']['datetime_dt'];
    //
    // for (data_point in linechart_data) {
    //     console.log(data_point);
    // }

    var pieWidth = 200;


    $.getJSON('https://analize.parlameter.si/v1/s/getMotionGraph/2931/', function(r) {

        var livedata = r.results.layered_data;
        console.log(livedata);

        drawInner(livedata);

        var second_level_data = [];
        for (option in livedata) {
            for (party in livedata[option]['breakdown']) {
                newdict = livedata[option]['breakdown'][party];
                newdict['option'] = livedata[option]['option'];
                second_level_data.push(livedata[option]['breakdown'][party])
            }
        }

        drawOuter(second_level_data);

    });

});
