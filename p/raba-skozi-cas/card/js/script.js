$.getJSON('https://isci.parlameter.si/q/zdravstvo', function(r) {
    raw_data = r['facet_counts']['facet_dates']['datetime_dt'];

    console.log(raw_data);

    var dates = [];
    var occurences = [];

    var date_formatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

    var data = []

    var ticks = []

    for (piece in raw_data) {
        dates.push(date_formatter.parse(piece));
        occurences.push(raw_data[piece]);
        if (piece != 'end') {
            if (piece != 'start') {
                if (piece != 'gap') {
                    data.push({
                        'date': piece,
                        'close': parseInt(raw_data[piece])
                    });
                }
            }
        }
    }

    data.sort(function(x, y) {
        return date_formatter.parse(x.date) - date_formatter.parse(y.date);
    });

    // for (piece in data) {
    //     if (piece % 2 === 0) {
    //         ticks.push(date_formatter.parse(data[piece].date));
    //     }
    // }

    var margin = {
        top: 30,
        right: 30,
        bottom: 30,
        left: 30
    };
    var width = 960 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;

    var SI = d3.locale({
        "decimal": ",",
        "thousands": " ",
        "grouping": [3],
        "currency": ["EUR", ""],
        "dateTime": "%d. %m. %Y %H:%M",
        "date": "%d. %m. %Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["nedelja", "ponedeljek", "torek", "sreda", "četrtek", "petek", "sobota"],
        "shortDays": ["ned", "pon", "tor", "sre", "čet", "pet", "sob"],
        "months": ["januar", "februar", "marec", "april", "maj", "junij", "julij", "avgust", "september", "oktober", "november", "december"],
        "shortMonths": ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "avg", "sep", "okt", "nov", "dec"]
    });

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(data.length / 2)
        .tickFormat(SI.timeFormat('%b %y'));
    // .tickValues(ticks);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    var line = d3.svg.line()
        .x(function(d) {
            console.log('date' + x(d.date));
            return x(d.date);
        })
        .y(function(d) {
            console.log(x(d.close));
            return y(d.close);
        });

    var svg = d3.select(".timechart").append("svg")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr('viewBox', '0 0 960 400')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        console.log(d);
        console.log(d.date);
        console.log(parseDate(d.date));
        d.date = parseDate(d.date);
        console.log(d.date);
        d.close = +d.close;
    });

    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.close;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    console.log('ping');

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //     .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("Število pojavitev");

    console.log('ping2');

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    console.log('ping3');

    svg.selectAll("g.dot")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "dot")
        .append("circle")
        .attr("r", 11)
        .attr("cx", function(d, i) {
            console.log(d.date);
            return x(d.date);
        })
        .attr("cy", function(d, i) {
            return y(d.close);
        });

    svg.selectAll('g.dot')
        .data(data)
        .append('text')
        // .attr('dx', function(d) {
        //     return -20
        // })
        // .attr("cx", function(d, i) {
        //     console.log(d.date);
        //     return x(d.date);
        // })
        // .attr("cy", function(d, i) {
        //     return y(d.close);
        // })
        .attr('transform', function(d) {
            return 'translate(' + (x(d.date) - 8) + ',' + (y(d.close) + 5) + ')'
        })
        .text(function(d) {
            return d.close
        });

    // var aspect = width / height,
    //     chart = d3.select('#chart');
    // d3.select(window)
    //     .on("resize", function() {
    //         var targetWidth = chart.node().getBoundingClientRect().width;
    //         chart.attr("width", targetWidth);
    //         chart.attr("height", targetWidth / aspect);
    //     });
});

// function type(d) {
//     d.date = parseDate.parse(d.date);
//     d.close = +d.close;
//     return d;
// }
