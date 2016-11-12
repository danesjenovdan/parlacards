/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* end of bootstrap tabs */

var mydata;
var data = [];
var smalldata = [];
var bigdata = [];

mydata = raba_data;
raw_data = raba_data['facet_counts']['facet_ranges']['datetime_dt'];

var date_formatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

var ticks = []

// create small data
var dates = [];
var occurences = [];
for (i = 0; i < raw_data['counts'].length; i++) {
    if (i % 2 === 0 && i > raw_data['counts'].length - 25) {
        dates.push(date_formatter.parse(raw_data['counts'][i]));
        occurences.push(raw_data['counts'][i + 1]);
        data.push({
            'date': raw_data['counts'][i],
            'occurences': raw_data['counts'][i + 1]
        });
        smalldata.push({
            'date': raw_data['counts'][i],
            'occurences': raw_data['counts'][i + 1]
        });
    }
}

// create big data
var dates = [];
var occurences = [];
for (i = 0; i < raw_data['counts'].length; i++) {
    if (i % 2 === 0) {
        dates.push(date_formatter.parse(raw_data['counts'][i]));
        occurences.push(raw_data['counts'][i + 1]);
        bigdata.push({
            'date': raw_data['counts'][i],
            'occurences': raw_data['counts'][i + 1]
        });
    }
}

data.sort(function(x, y) {
    return date_formatter.parse(x.date) - date_formatter.parse(y.date);
});
smalldata.sort(function(x, y) {
    return date_formatter.parse(x.date) - date_formatter.parse(y.date);
});
bigdata.sort(function(x, y) {
    return date_formatter.parse(x.date) - date_formatter.parse(y.date);
});

// global stuff for the chart
var margin = {
    top: 50,
    right: 30,
    bottom: 30,
    left: 30
};
var width = 960 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

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

var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%SZ").parse;
var bisectDate = d3.bisector(function(d) {
        return d.date;
    }).left;
data.forEach(function(d) {
    d.date = parseDate(d.date);
    d.occurences = +d.occurences;
});
smalldata.forEach(function(d) {
    d.date = parseDate(d.date);
    d.occurences = +d.occurences;
});
bigdata.forEach(function(d) {
    d.date = parseDate(d.date);
    d.occurences = +d.occurences;
});

var svg = d3.select(".timechart").append("svg")
    .attr('class', 'smalldata')
    .attr('viewBox', '0 0 960 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


function createSmallChart(data) {

    svg.selectAll(".dot").remove();
    svg.selectAll('.smalldata g path').remove();
    d3.select('.overlay').remove();
    svg.selectAll(".axis").remove();
    svg.on('mousemove', null);

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.occurences; })]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickFormat(SI.timeFormat('%b %y'));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg.append("g")
        .attr("class", "x axis smalldata")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var barcontainers = svg.selectAll(".smallbarcontainer")
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'smallbarcontainer');

    barcontainers.append('text')
        .text(function(d) {
            return d.occurences;
        })
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("y", function(d) {
            return y(d.occurences);
        })
        .attr('width', x.rangeBand)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + x.rangeBand()/2 + ', -4)');

    barcontainers.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.occurences);
        })
        .attr("height", function(d) {
            return height - y(d.occurences);
        });
}

function createBigChart(data) {

    svg.selectAll(".smallbarcontainer").remove();
    svg.selectAll(".axis").remove();

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear()
        .range([height, 0]);

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.occurences; })]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        //.tickValues(x.domain().filter(function(d, i) { return !(i % 5); }))
        .tickFormat(SI.timeFormat('%b %y'));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg.append("g")
        .attr("class", "x axis bigdata")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    var barcontainers = svg.selectAll(".bigbarcontainer")
        .remove()
        .data(data)
        .enter()
        .append('g')
        .attr('class', 'bigbarcontainer')
        .on('mouseover', function(d) {
            var a = d3.select(this).datum();
            var b = d3.selectAll('.tick')
                .filter(function(d) {
                    return a.date === d;
                })
                .select('text')
                .style('opacity', 1);
        })
        .on('mouseleave', function(d) {
            var a = d3.select(this).datum();
            var b = d3.selectAll('.tick')
                .filter(function(d) {
                    return a.date === d;
                })
                .select('text')
                .style('opacity', 0);
        });;

    barcontainers.append('text')
        .text(function(d) {
            return d.occurences;
        })
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("y", function(d) {
            return y(d.occurences);
        })
        .attr('width', x.rangeBand)
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + x.rangeBand()/2 + ', -4)');

    barcontainers.append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.occurences);
        })
        .attr("height", function(d) {
            return height - y(d.occurences);
        });
}

function createLineChart(data) {
    svg.selectAll(".smallbarcontainer").remove();
    svg.selectAll(".axis").remove();
    
    d3.select(svg.node().parentNode).append("rect")
      .attr("class", "overlay")
      .attr("width", '100%')
      .attr("height", '100%')
      .style('fill', 'transparent')
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    // x.domain(data.map(function(d) { return d.date; }));
    x.domain(d3.extent(data, function(d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function(d) { return d.occurences; })]);
    // y.domain(d3.extent(data, function(d) {
    //     return d.close;
    // }));

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom")
        //.tickValues(x.domain().filter(function(d, i) { return !(i % 5); }))
        .tickFormat(SI.timeFormat('%b %y'));

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    svg.append("g")
        .attr("class", "x axis bigdata")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
    
    var line = d3.svg.line()
        .x(function(d) {
            console.log('date' + x(d.date));
            return x(d.date);
        })
        .y(function(d) {
            console.log(d);
            console.log(y(d.occurences));
            return y(d.occurences);
        });

    // data.forEach(function(d) {
    //     console.log(d);
    //     console.log(d.date);
    //     d.date = parseDate(d.date);
    //     console.log(d.date);
    //     d.close = +d.close;
    // });

    console.log(line);
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    function mousemove() {
        var x0 = x.invert(d3.mouse(this)[0] - margin.left),
            i = bisectDate(data, x0, 1),
            d0 = data[i - 1],
            d1 = data[i],
            d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        var circle = x0 - d0.date > d1.date - x0 ? d3.selectAll('.dot circle')[0][i] : d3.selectAll('.dot circle')[0][i - 1];

        if (d3.select(circle).classed('hovered')) {

        } else {
            d3.select('.dot circle.hovered')
                .classed('hovered', false)
                .transition()
                .duration(200)
                .attr('r', 4);
            
            d3.select(circle)
                .classed('hovered', true)
                .transition()
                .duration(200)
                .ease('linear')
                .attr('r', 7);
        }

        if (2 < i && i < data.length - 3.5) {
            focus.attr("transform", "translate(" + x(d.date) + "," + y(d.occurences) + ")");
        } else if (i < 3) {
            focus.attr("transform", "translate(" + x(data[2].date) + "," + y(d.occurences) + ")");
        } else {
            focus.attr("transform", "translate(" + x(data[data.length - 4].date) + "," + y(d.occurences) + ")");
        }
        
        focus.select("text").text(SI.timeFormat('%B %Y')(d.date) + ' | ' + d.occurences);
    }

    svg.selectAll("g.dot")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "dot")
        .append("circle")
        .attr("r", 4)
        .attr("cx", function(d, i) {
            console.log(d.date);
            return x(d.date);
        })
        .attr("cy", function(d, i) {
            return y(d.occurences);
        })
        .on("mouseover", function(d) { // setup tooltip
            tooltipdiv.transition()
                .duration(200)
                .style("opacity", .9);

            // console.log($(this).parents('#kompas-scatter')));
            tooltipdiv.html(d.occurences)
                .style("left", (d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('.timechart').offset().left + 10 + "px"))
                .style("top", (d3.event.pageY - $('.timechart').offset().top - 30) + "px");
            
            console.log('ping');
            })

        .on("mouseout", function(d) {
            tooltipdiv.transition()
                .duration(200)
                .style("opacity", 0);
        });

        var focus = svg.append("g")
            .attr("class", "focus")
            .style("display", "none");

        // var focuscircle = focus.append("circle")
        //     .attr("r", 4);
        
        focus.append('rect')
            .attr('width', 150)
            .attr('height', 25)
            .attr('y', -35)
            .attr('x', -75)
            .style('rx', 3)
            .style('yx', 3);

        focus.append("text")
            .style('fill', '#ffffff')
            .attr('text-anchor', 'middle')
            .attr('y', -18);

    // svg.selectAll('g.dot')
    //     .data(data)
    //     .append('text')
    //     // .attr('dx', function(d) {
    //     //     return -20
    //     // })
    //     // .attr("cx", function(d, i) {
    //     //     console.log(d.date);
    //     //     return x(d.date);
    //     // })
    //     // .attr("cy", function(d, i) {
    //     //     return y(d.close);
    //     // })
    //     .attr('transform', function(d) {
    //         return 'translate(' + (x(d.date) - 8) + ',' + (y(d.close) + 5) + ')'
    //     })
    //     .text(function(d) {
    //         return d.close
    //     });

    // var barcontainers = svg.selectAll(".bigbarcontainer")
    //     .remove()
    //     .data(data)
    //     .enter()
    //     .append('g')
    //     .attr('class', 'bigbarcontainer')
    //     .on('mouseover', function(d) {
    //         var a = d3.select(this).datum();
    //         var b = d3.selectAll('.tick')
    //             .filter(function(d) {
    //                 return a.date === d;
    //             })
    //             .select('text')
    //             .style('opacity', 1);
    //     })
    //     .on('mouseleave', function(d) {
    //         var a = d3.select(this).datum();
    //         var b = d3.selectAll('.tick')
    //             .filter(function(d) {
    //                 return a.date === d;
    //             })
    //             .select('text')
    //             .style('opacity', 0);
    //     });;

    // barcontainers.append('text')
    //     .text(function(d) {
    //         return d.occurences;
    //     })
    //     .attr("x", function(d) {
    //         return x(d.date);
    //     })
    //     .attr("y", function(d) {
    //         return y(d.occurences);
    //     })
    //     .attr('width', x.rangeBand)
    //     .attr('text-anchor', 'middle')
    //     .attr('transform', 'translate(' + x.rangeBand()/2 + ', -4)');

    // barcontainers.append("rect")
    //     .attr("class", "bar")
    //     .attr("x", function(d) {
    //         return x(d.date);
    //     })
    //     .attr("width", x.rangeBand())
    //     .attr("y", function(d) {
    //         return y(d.occurences);
    //     })
    //     .attr("height", function(d) {
    //         return height - y(d.occurences);
    //     });
}

createSmallChart(smalldata);

$('#smalldata' + random_id).on('click', function() {
    createSmallChart(smalldata);
});
$('#bigdata' + random_id).on('click', function() {
    createLineChart(bigdata);
});
