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

    console.log('starting drawInner');

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
    console.log('starting drawOuter');
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

}

function drawLabels(data) {
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.total_votes;
        });

    var piedata = pie(data);

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
            return d.data.acronym;
        })
        .each(function(d) {
            var bbox = this.getBBox();
            d.sx = d.x - bbox.width / 2 - 2;
            d.ox = d.x + bbox.width / 2 + 2;
            d.sy = d.oy = d.y + 5;
        });

    var alpha = 0.5;
    var spacingY = 14;
    var spacingX = 24;

    function relax() {
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

                if ((Math.abs(deltaY) > spacingY) || (Math.abs(deltaX) > spacingX)) return;
                // if (Math.abs(deltaX) > spacingY) return;

                // if we didn't break until now, labels are overlapping
                again = true;
                sign = deltaY > 0 ? 1 : -1;
                adjust = sign * alpha;
                da.attr('y', +y1 + adjust);
                db.attr('y', +y2 - adjust);

                // update line coordinates
                da.sy = da.oy = da.y + 5;
                db.sy = db.oy = db.y + 5;

                if (again) {
                    setTimeout(relax, 20);
                }
            });
        });

    }

    relax();

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
var radius = Math.min(width, height) / 3;

var color = d3.scale.ordinal()
    .range(["#009CDD", "#00628C", "#99E1FF", "#003B54"]);

var svg = d3.select(".partychart").append("svg")
    .attr('viewBox', '0 0 400 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

var pieWidth = 200;


$.getJSON('https://analize.parlameter.si/v1/s/getMotionGraph/2931/', function(r) {

    var livedata = r.results.layered_data;
    console.log(livedata);
    console.log('before drawInner');

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

    drawLabels(second_level_data);

});
