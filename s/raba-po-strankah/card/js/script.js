$.getJSON('https://data.parlameter.si/v1/getAllPGsExt/', function(response) {

    var parties = response;

    $.getJSON('https://isci.parlameter.si/q/zdravstvo', function(r) {
        raw_data = r['facet_counts']['facet_fields']['party_i'];
        console.log(raw_data);
        var sum = 0;
        for (datum in raw_data) {
            if (datum % 2 == 1) {
                sum = sum + raw_data[datum];
            }
        }

        var date_formatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

        var data = []

        var ticks = []

        var firstpiece, secondpiece;
        for (piece in raw_data) {
            if (piece % 2 === 0) {
                firstpiece = raw_data[piece];
            } else {
                secondpiece = raw_data[piece];
                console.log(secondpiece / sum * 100)
                data.push({
                    'party': firstpiece,
                    'occurences': secondpiece,
                    'percentage': Math.round(secondpiece / sum * 100)
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
                return d.occurences;
            });


        var svg = d3.select(".partychart2").append("svg")
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
                return parties[d.data.party]['acronym'] + ' | ' + d.data.percentage + '%';
            })

        var alpha = 0.5;
        var spacingY = 20;
        var spacingX = 20;

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

                    // handle Y spacing
                    if (Math.abs(deltaY) > spacingY) {
                        return;
                    } else {
                        // if we didn't break until now, labels are overlapping
                        again = true;
                        sign = deltaY > 0 ? 1 : -1;
                        adjust = sign * alpha;
                        da.attr('y', +y1 + adjust);
                        db.attr('y', +y2 - adjust);
                    }

                    // handle X spacing
                    if (Math.abs(deltaX) > spacingX) {
                        return;
                    } else {
                        // if we didn't break until now, labels are overlapping
                        again = true;
                        sign = deltaX > 0 ? 1 : -1;
                        adjust = sign * alpha;
                        da.attr('x', +x1 + adjust);
                        db.attr('x', +x2 - adjust);
                    }

                });
            });

            if (again) {
                setTimeout(relax, 20);
            } else {
                drawLines();
            }

        }

        relax();


        // svg.append("defs").append("marker")
        //     .attr("id", "circ")
        //     .attr("markerWidth", 6)
        //     .attr("markerHeight", 6)
        //     .attr("refX", 3)
        //     .attr("refY", 3)
        //     .append("circle")
        //     .attr("cx", 3)
        //     .attr("cy", 3)
        //     .attr("r", 3);

        function drawLines() {

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
                .attr("marker-end", "url(#circ)")
                .attr("d", function(d) {
                    console.log(d);
                    if (d.cx > d.ox) { //|| Math.abs(d.cx) < 0.1) {
                        return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                    } else {
                        if ((d.endx > 0) && (Math.abs(d.cx) < 10)) {
                            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
                        }
                        return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
                    }
                });
        }

    });

});

// function type(d) {
//     d.date = parseDate.parse(d.date);
//     d.occurences = +d.occurences;
//     return d;
// }
