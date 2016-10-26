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
    top: 30,
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

    svg.selectAll(".bigbarcontainer").remove();
    svg.selectAll(".axis").remove();

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
        // .tickValues(x.domain().filter(function(d, i) { return !(i % 3); }))
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

createSmallChart(smalldata);

$('#smalldata' + random_id).on('click', function() {
    createSmallChart(smalldata);
});
$('#bigdata' + random_id).on('click', function() {
    createBigChart(bigdata);
});
