var mydata;
var data = [];

// $.getJSON('https://isci.parlameter.si/q/zdravstvo', function(r) {
    // console.log(r);
    mydata = raba_data;
    raw_data = raba_data['facet_counts']['facet_ranges']['datetime_dt'];

    // console.log(raw_data);

    var dates = [];
    var occurences = [];

    var date_formatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

    // var data = []

    var ticks = []

    for (i = 0; i < raw_data['counts'].length; i++) {
        if (i % 2 === 0 && i > raw_data['counts'].length - 25) {
            dates.push(date_formatter.parse(raw_data['counts'][i]));
            occurences.push(raw_data['counts'][i + 1]);
            data.push({
                'date': raw_data['counts'][i],
                'occurences': raw_data['counts'][i + 1]
            });
        }
    }

    data.sort(function(x, y) {
        return date_formatter.parse(x.date) - date_formatter.parse(y.date);
    });

    // console.log(data);

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

    console.log(width, data.length);

    var x = d3.time.scale()
        .range([0, width]);
    // var x = d3.time.scale().nice(12).range([0, width]);
    // var x = d3.scale.ordinal().domain(dates).range([0, width]);

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

    // var line = d3.svg.line()
    //     .x(function(d) {
    //         // console.log('date' + x(d.date));
    //         return x(d.date);
    //     })
    //     .y(function(d) {
    //         // console.log(x(d.occurences));
    //         return y(d.occurences);
    //     });

    var svg = d3.select(".timechart").append("svg")
        // .attr("width", width + margin.left + margin.right)
        // .attr("height", height + margin.top + margin.bottom)
        .attr('viewBox', '0 0 960 400')
        .attr('preserveAspectRatio', 'xMidYMid meet')
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    data.forEach(function(d) {
        // console.log(d);
        // console.log(d.date);
        // console.log(parseDate(d.date));
        d.date = parseDate(d.date);
        // console.log(d.date);
        d.occurences = +d.occurences;
    });

    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.occurences;
    }));

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // console.log('ping');

    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("width", width / data.length)
        .attr("y", function(d) {
            return y(d.occurences);
        })
        .attr("height", function(d) {
            return height - y(d.occurences);
        });

    // svg.append("g")
    //     .attr("class", "y axis")
    //     .call(yAxis)
    //     .append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 6)
    //     .attr("dy", ".71em")
    //     .style("text-anchor", "end")
    //     .text("Število pojavitev");

    // console.log('ping2');

    // svg.append("path")
    //     .datum(data)
    //     .attr("class", "line")
    //     .attr("d", line);

    // console.log('ping3');

    // svg.selectAll("g.dot")
    //     .data(data)
    //     .enter()
    //     .append("g")
    //     .attr("class", "dot")
    //     .append("circle")
    //     .attr("r", 11)
    //     .attr("cx", function(d, i) {
    //         // console.log(d.date);
    //         return x(d.date);
    //     })
    //     .attr("cy", function(d, i) {
    //         return y(d.occurences);
    //     });
    //
    // svg.selectAll('g.dot')
    //     .data(data)
    //     .append('text')
    //     // .attr('dx', function(d) {
    //     //     return -20
    //     // })
    //     // .attr("cx", function(d, i) {
    //     //     // console.log(d.date);
    //     //     return x(d.date);
    //     // })
    //     // .attr("cy", function(d, i) {
    //     //     return y(d.occurences);
    //     // })
    //     .attr('transform', function(d) {
    //         return 'translate(' + (x(d.date) - 8) + ',' + (y(d.occurences) + 5) + ')'
    //     })
    //     .text(function(d) {
    //         return d.occurences
    //     });

    // var aspect = width / height,
    //     chart = d3.select('#chart');
    // d3.select(window)
    //     .on("resize", function() {
    //         var targetWidth = chart.node().getBoundingClientRect().width;
    //         chart.attr("width", targetWidth);
    //         chart.attr("height", targetWidth / aspect);
    //     });
// });

// function type(d) {
//     d.date = parseDate.parse(d.date);
//     d.occurences = +d.occurences;
//     return d;
// }
