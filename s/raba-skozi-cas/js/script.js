((randomId) => {
  let data = [];
  let smalldata = [];
  let bigdata = [];

  let mydata = raba_data;
  let raw_data = raba_data.facet_counts.facet_ranges.datetime_dt;

  let date_formatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

  let ticks = [];

  // create small data
  let dates = [];
  let occurences = [];
  for (let i = 0; i < raw_data.counts.length; i += 1) {
    if (i % 2 === 0 && i > raw_data.counts.length - 25) {
      dates.push(date_formatter.parse(raw_data.counts[i]));
      occurences.push(raw_data.counts[i + 1]);
      data.push({
        date: raw_data.counts[i],
        occurences: raw_data.counts[i + 1],
      });
      smalldata.push({
        date: raw_data.counts[i],
        occurences: raw_data.counts[i + 1],
      });
    }
  }

  // create big data
  let bigDates = [];
  let bigOccurences = [];
  for (let i = 0; i < raw_data.counts.length; i += 1) {
    if (i % 2 === 0) {
      bigDates.push(date_formatter.parse(raw_data.counts[i]));
      bigOccurences.push(raw_data.counts[i + 1]);
      bigdata.push({
        date: raw_data.counts[i],
        occurences: raw_data.counts[i + 1],
      });
    }
  }

  data.sort((x, y) => {
    return date_formatter.parse(x.date) - date_formatter.parse(y.date);
  });
  smalldata.sort((x, y) => {
    return date_formatter.parse(x.date) - date_formatter.parse(y.date);
  });
  bigdata.sort((x, y) => {
    return date_formatter.parse(x.date) - date_formatter.parse(y.date);
  });

  // global stuff for the chart
  let margin = {
    top: 50,
    right: 30,
    bottom: 30,
    left: 30,
  };
  let width = 960 - margin.left - margin.right;
  let height = 400 - margin.top - margin.bottom;

  let SI = d3.locale({
    'decimal': ',',
    thousands: ' ',
    grouping: [3],
    currency: ['EUR', ''],
    dateTime: '%d. %m. %Y %H:%M',
    'date': '%d. %m. %Y',
    'time': '%H:%M:%S',
    'periods': ['AM', 'PM'],
    days: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'],
    shortDays: ['ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob'],
    'months': ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
    'shortMonths': ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
  });

  let parseDate = d3.time.format('%Y-%m-%dT%H:%M:%SZ').parse;
  let bisectDate = d3.bisector((d) => {
    return d.date;
  }).left;
  data.forEach((d) => {
    d.date = parseDate(d.date);
    d.occurences = +d.occurences;
  });
  smalldata.forEach((d) => {
    d.date = parseDate(d.date);
    d.occurences = +d.occurences;
  });
  bigdata.forEach((d) => {
    d.date = parseDate(d.date);
    d.occurences = +d.occurences;
  });

  let svg = d3.select('.timechart').append('svg')
    .attr('class', 'smalldata')
    .attr('viewBox', '0 0 960 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');


  function createSmallChart(data) {
    svg.selectAll('.dot').remove();
    svg.selectAll('.smalldata g path').remove();
    d3.select('.overlay').remove();
    svg.selectAll('.axis').remove();
    svg.on('mousemove', null);

    let x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

    let y = d3.scale.linear()
      .range([height, 0]);

    x.domain(data.map((d) => {
      return d.date;
    }));
    y.domain([0, d3.max(data, (d) => {
      return d.occurences;
    })]);

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickFormat(SI.timeFormat('%b %y'));

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    svg.append('g')
      .attr('class', 'x axis smalldata')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    let barcontainers = svg.selectAll('.smallbarcontainer')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'smallbarcontainer');

    barcontainers.append('text')
      .text((d) => {
        return d.occurences;
      })
      .attr('x', (d) => {
        return x(d.date);
      })
      .attr('y', (d) => {
        return y(d.occurences);
      })
      .attr('width', x.rangeBand)
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${  x.rangeBand()/2  }, -4)`);

    barcontainers.append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => {
        return x(d.date);
      })
      .attr('width', x.rangeBand())
      .attr('y', (d) => {
        return y(d.occurences);
      })
      .attr('height', (d) => {
        return height - y(d.occurences);
      });
  }

  function createBigChart(data) {
    svg.selectAll('.smallbarcontainer').remove();
    svg.selectAll('.axis').remove();

    let x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

    let y = d3.scale.linear()
      .range([height, 0]);

    x.domain(data.map((d) => {
      return d.date;
    }));
    y.domain([0, d3.max(data, (d) => {
      return d.occurences;
    })]);

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      // .tickValues(x.domain().filter(function(d, i) { return !(i % 5); }))
      .tickFormat(SI.timeFormat('%b %y'));

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    svg.append('g')
      .attr('class', 'x axis bigdata')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    let barcontainers = svg.selectAll('.bigbarcontainer')
      .remove()
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bigbarcontainer')
      .on('mouseover', function (d) {
        let a = d3.select(this).datum();
        let b = d3.selectAll('.tick')
          .filter((d) => {
            return a.date === d;
          })
          .select('text')
          .style('opacity', 1);
      })
      .on('mouseleave', function (d) {
        let a = d3.select(this).datum();
        let b = d3.selectAll('.tick')
          .filter((d) => {
            return a.date === d;
          })
          .select('text')
          .style('opacity', 0);
      });

    barcontainers.append('text')
      .text((d) => {
        return d.occurences;
      })
      .attr('x', (d) => {
        return x(d.date);
      })
      .attr('y', (d) => {
        return y(d.occurences);
      })
      .attr('width', x.rangeBand)
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${  x.rangeBand()/2  }, -4)`);

    barcontainers.append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => {
        return x(d.date);
      })
      .attr('width', x.rangeBand())
      .attr('y', (d) => {
        return y(d.occurences);
      })
      .attr('height', (d) => {
        return height - y(d.occurences);
      });
  }

  function createLineChart(data) {
    svg.selectAll('.smallbarcontainer').remove();
    svg.selectAll('.axis').remove();

    d3.select(svg.node().parentNode).append('rect')
      .attr('class', 'overlay')
      .attr('width', '100%')
      .attr('height', '100%')
      .style('fill', 'transparent')
      .on('mouseover', () => {
        focus.style('display', null);
      })
      .on('mouseout', () => {
        focus.style('display', 'none');
      })
      .on('mousemove', mousemove);

    let x = d3.time.scale()
      .range([0, width]);

    let y = d3.scale.linear()
      .range([height, 0]);

    // x.domain(data.map(function(d) { return d.date; }));
    x.domain(d3.extent(data, (d) => {
      return d.date;
    }));
    y.domain([0, d3.max(data, (d) => {
      return d.occurences;
    })]);
    // y.domain(d3.extent(data, function(d) {
    //     return d.close;
    // }));

    let xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      // .tickValues(x.domain().filter(function(d, i) { return !(i % 5); }))
      .tickFormat(SI.timeFormat('%b %y'));

    let yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    svg.append('g')
      .attr('class', 'x axis bigdata')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis);

    let line = d3.svg.line()
      .x((d) => {
        // console.log('date' + x(d.date));
        return x(d.date);
      })
      .y((d) => {
        // console.log(d);
        // console.log(y(d.occurences));
        return y(d.occurences);
      });

    // data.forEach(function(d) {
    //     console.log(d);
    //     console.log(d.date);
    //     d.date = parseDate(d.date);
    //     console.log(d.date);
    //     d.close = +d.close;
    // });

    // console.log(line);
    svg.append('path')
      .datum(data)
      .attr('class', 'line')
      .attr('d', line);

    function mousemove() {
      const x0 = x.invert(d3.mouse(this)[0] - margin.left);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      if (i < data.length) {
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        const circle = x0 - d0.date > d1.date - x0 ? d3.selectAll('.dot circle')[0][i] : d3.selectAll('.dot circle')[0][i - 1];

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

        if (i > 2 && i < data.length - 3.5) {
            focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.occurences) + ')');
        } else if (i < 3) {
            focus.attr('transform', 'translate(' + x(data[2].date) + ',' + y(d.occurences) + ')');
        } else {
            focus.attr('transform', 'translate(' + x(data[data.length - 4].date) + ',' + y(d.occurences) + ')');
        }

        focus.select('text').text(`${SI.timeFormat('%B %Y')(d.date)  } | ${  d.occurences}`);
      }
    }

    svg.selectAll('g.dot')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'dot')
      .append('circle')
      .attr('r', 4)
      .attr('cx', (d, i) => {
        // console.log(d.date);
        return x(d.date);
      })
      .attr('cy', (d, i) => {
        return y(d.occurences);
      })
      .on('mouseover', (d) => { // setup tooltip
        tooltipdiv.transition()
          .duration(200)
          .style('opacity', 0.9);

        // console.log($(this).parents('#kompas-scatter')));
        tooltipdiv.html(d.occurences)
          .style('left', (`${d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('.timechart').offset().left + 10  }px`))
          .style('top', `${d3.event.pageY - $('.timechart').offset().top - 30  }px`);

        // console.log('ping');
      })

    .on('mouseout', (d) => {
      tooltipdiv.transition()
        .duration(200)
        .style('opacity', 0);
    });

    let focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('rect')
      .attr('width', 150)
      .attr('height', 25)
      .attr('y', -35)
      .attr('x', -75)
      .style('rx', 3)
      .style('yx', 3);

    focus.append('text')
      .style('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('y', -18);
  }

  createLineChart(bigdata);

  const toggleTabAndExecuteCallback = callback =>
    (event) => {
      const $tabElement = $(event.currentTarget);
      if ($tabElement.hasClass('active')) {
        return;
      }

      $tabElement.addClass('active')
        .siblings().removeClass('active');

      callback();
    };

  $(`#smalldata${  randomId}`).on('click', toggleTabAndExecuteCallback(() => createSmallChart(smalldata)));
  $(`#bigdata${  randomId}`).on('click', toggleTabAndExecuteCallback(() => createLineChart(bigdata)));

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})( /* SCRIPT_PARAMS */ );