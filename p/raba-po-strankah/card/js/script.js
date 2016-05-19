$.getJSON('https://isci.parlameter.si/q/zdravstvo', function(r) {
    raw_data = r['facet_counts']['facet_fields']['party_i'];

    var date_formatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

    var data = []

    var ticks = []

    var firstpiece, secondpiece;
    for (piece in raw_data) {
        if (piece % 2 === 0) {
            firstpiece = raw_data[piece];
        } else {
            secondpiece = raw_data[piece];
            data.push({
                'party': firstpiece,
                'close': secondpiece
            });
        }
    }

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };
    var width = 400 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;
    var radius = Math.min(width, height) / 2;

    var color = d3.scale.ordinal()
        .range(["#8FCFEE", "#4FB5E6", "#AA7375", "#534961", "#4F6379", "#5388AA", "#D9776B", "#BA594C"]);

    var arc = d3.svg.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);


    var labelArc = d3.svg.arc()
        .outerRadius(radius - 50)
        .innerRadius(radius - 100);


    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.close;
        });


    var svg = d3.select(".partychart").append("svg")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr('viewBox', '0 0 400 400')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    var piedata = pie(data);

    var g = svg.selectAll('.arc')
        .data(piedata)
        .enter()
        .append('g')
        .attr('class', 'arc');

    g.append('path')
        .attr('d', arc)
        .style('fill', function(d) {
            return color(d.data.party);
        });

    var labels = svg.selectAll("text").data(piedata)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cx = Math.cos(a) * (radius - 75);
            return d.x = Math.cos(a) * (radius + 20);
        })
        .attr("y", function(d) {
            var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
            d.cy = Math.sin(a) * (radius - 75);
            return d.y = Math.sin(a) * (radius + 20);
        })
        .text(function(d) {
            return d.data.party;
        })
        .each(function(d) {
            var bbox = this.getBBox();
            d.sx = d.x - bbox.width / 2 - 2;
            d.ox = d.x + bbox.width / 2 + 2;
            d.sy = d.oy = d.y + 5;
        });

    // var prev;
    // labels.each(function(d, i) {
    //     if (i > 0) {
    //         var thisbb = this.getBoundingClientRect(),
    //             prevbb = prev.getBoundingClientRect();
    //         // move if they overlap
    //         if (!(thisbb.right < prevbb.left ||
    //                 thisbb.left > prevbb.right ||
    //                 thisbb.bottom < prevbb.top ||
    //                 thisbb.top > prevbb.bottom)) {
    //             var ctx = thisbb.left + (thisbb.right - thisbb.left) / 2,
    //                 cty = thisbb.top + (thisbb.bottom - thisbb.top) / 2,
    //                 cpx = prevbb.left + (prevbb.right - prevbb.left) / 2,
    //                 cpy = prevbb.top + (prevbb.bottom - prevbb.top) / 2,
    //                 off = Math.sqrt(Math.pow(ctx - cpx, 2) + Math.pow(cty - cpy, 2)) / 2;
    //             d3.select(this).attr("transform",
    //                 "translate(" + Math.cos(((d.startAngle + d.endAngle - Math.PI) / 2)) *
    //                 (radius + off) + "," +
    //                 Math.sin((d.startAngle + d.endAngle - Math.PI) / 2) *
    //                 (radius + off) + ")");
    //         }
    //     }
    //     prev = this;
    // });


    svg.append("defs").append("marker")
        .attr("id", "circ")
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("refX", 3)
        .attr("refY", 3)
        .append("circle")
        .attr("cx", 3)
        .attr("cy", 3)
        .attr("r", 3);

    svg.selectAll("path.pointer").data(piedata).enter()
        .append("path")
        .attr("class", "pointer")
        .style("fill", "none")
        .style("stroke", "black")
        .attr("marker-end", "url(#circ)")
        .attr("d", function(d) {
            if (d.cx > d.ox) {
                return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
            } else {
                return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
            }
        });

});

// function type(d) {
//     d.date = parseDate.parse(d.date);
//     d.close = +d.close;
//     return d;
// }
