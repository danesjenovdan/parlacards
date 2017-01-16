((randomId) => {
  let time_query;
  if (typeof query !== 'undefined') {
    time_query = query;
  } else {
    if (typeof customUrl !== 'undefined') {
      time_query = getQueryParams(customUrl.split('?')[1]);
      time_query['q'] = customUrl.split('/').pop().split('?')[0];
    } else {
      time_query = {q: document.location.href.split('?q=')[1]};
    }
  }

  function getQueryParams(str) {
    return (str || document.location.search).replace(/(^\?)/, '').split('&').map(function (n) {
      return n = n.split('='), this[n[0]] = n[1], this;
    }.bind({}))[0];
  }

  function generateSearchUrl(queryParams) {
    let searchurl = 'https://parlameter.si/seje/isci/filter/?q=' + time_query.q;
    if (queryParams.people && queryParams.people.length > 0) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl  }&people=${  queryParams.people}`;
      } else {
        searchurl = `${searchurl  }people=${  queryParams.people}`;
      }
    }
    if (queryParams.parties && queryParams.parties.length > 0) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl  }&parties=${  queryParams.parties}`;
      } else {
        searchurl = `${searchurl  }parties=${  queryParams.parties}`;
      }
    }
    if (queryParams.time_filter && queryParams.time_filter.length > 0) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl  }&time_filter=${  queryParams.time_filter}`;
      } else {
        searchurl = `${searchurl  }time_filter=${  queryParams.time_filter}`;
      }
    }
    if (queryParams.wb && queryParams.wb.length > 0) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl  }&wb=${  queryParams.wb}`;
      } else {
        searchurl = `${searchurl  }wb=${  queryParams.wb}`;
      }
    }
    if (queryParams.dz) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl  }&dz=${  queryParams.dz}`;
      } else {
        searchurl = `${searchurl  }dz=${  queryParams.dz}`;
      }
    }
    if (queryParams.council) {
      if (!searchurl.endsWith('?')) {
        searchurl = `${searchurl  }&council=${  queryParams.council}`;
      } else {
        searchurl = `${searchurl  }council=${  queryParams.council}`;
      }
    }


    return searchurl;
  }

  const data = [];
  const smalldata = [];
  const bigdata = [];

  const mydata = raba_data;
  const raw_data = raba_data.facet_counts.facet_ranges.datetime_dt;

  const date_formatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

  const ticks = [];

  // create small data
  const dates = [];
  const occurences = [];
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
  const bigDates = [];
  const bigOccurences = [];
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

  data.sort((x, y) => date_formatter.parse(x.date) - date_formatter.parse(y.date));
  smalldata.sort((x, y) => date_formatter.parse(x.date) - date_formatter.parse(y.date));
  bigdata.sort((x, y) => date_formatter.parse(x.date) - date_formatter.parse(y.date));

  // global stuff for the chart
  const margin = {
    top: 50,
    right: 30,
    bottom: 30,
    left: 30,
  };
  const width = 960 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const SI = d3.locale({
    decimal: ',',
    thousands: ' ',
    grouping: [3],
    currency: ['EUR', ''],
    dateTime: '%d. %m. %Y %H:%M',
    date: '%d. %m. %Y',
    time: '%H:%M:%S',
    periods: ['AM', 'PM'],
    days: ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'],
    shortDays: ['ned', 'pon', 'tor', 'sre', 'čet', 'pet', 'sob'],
    months: ['januar', 'februar', 'marec', 'april', 'maj', 'junij', 'julij', 'avgust', 'september', 'oktober', 'november', 'december'],
    shortMonths: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'],
  });

  const parseDate = d3.time.format('%Y-%m-%dT%H:%M:%SZ').parse;
  const bisectDate = d3.bisector((d) => d.date).left;
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

  const svg = d3.select('.timechart').append('svg')
    .attr('class', 'smalldata')
    .attr('viewBox', '0 0 960 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${  margin.left  },${  margin.top  })`);


  function createSmallChart(data) {
    svg.selectAll('.dot').remove();
    svg.selectAll('.smalldata g path').remove();
    d3.select('.overlay').remove();
    svg.selectAll('.axis').remove();
    svg.on('mousemove', null);

    const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

    const y = d3.scale.linear()
      .range([height, 0]);

    x.domain(data.map((d) => d.date));
    y.domain([0, d3.max(data, (d) => d.occurences)]);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      .tickFormat(SI.timeFormat('%b %y'));

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    svg.append('g')
      .attr('class', 'x axis smalldata')
      .attr('transform', `translate(0,${  height  })`)
      .call(xAxis);

    const barcontainers = svg.selectAll('.smallbarcontainer')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'smallbarcontainer');

    barcontainers.append('text')
      .text((d) => d.occurences)
      .attr('x', (d) => x(d.date))
      .attr('y', (d) => y(d.occurences))
      .attr('width', x.rangeBand)
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${x.rangeBand() / 2 }, -4)`);

    barcontainers.append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.date))
      .attr('width', x.rangeBand())
      .attr('y', (d) => y(d.occurences))
      .attr('height', (d) => height - y(d.occurences));
  }

  function createBigChart(data) {
    svg.selectAll('.smallbarcontainer').remove();
    svg.selectAll('.axis').remove();

    const x = d3.scale.ordinal().rangeRoundBands([0, width], 0.05);

    const y = d3.scale.linear()
      .range([height, 0]);

    x.domain(data.map((d) => d.date));
    y.domain([0, d3.max(data, (d) => d.occurences)]);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      // .tickValues(x.domain().filter(function(d, i) { return !(i % 5); }))
      .tickFormat(SI.timeFormat('%b %y'));

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    svg.append('g')
      .attr('class', 'x axis bigdata')
      .attr('transform', `translate(0,${  height  })`)
      .call(xAxis);

    const barcontainers = svg.selectAll('.bigbarcontainer')
      .remove()
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bigbarcontainer')
      .on('mouseover', function (d) {
        const a = d3.select(this).datum();
        const b = d3.selectAll('.tick')
          .filter((d) => a.date === d)
          .select('text')
          .style('opacity', 1);
      })
      .on('mouseleave', function (d) {
        const a = d3.select(this).datum();
        const b = d3.selectAll('.tick')
          .filter((d) => a.date === d)
          .select('text')
          .style('opacity', 0);
      });

    barcontainers.append('text')
      .text((d) => d.occurences)
      .attr('x', (d) => x(d.date))
      .attr('y', (d) => y(d.occurences))
      .attr('width', x.rangeBand)
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${x.rangeBand() / 2 }, -4)`);

    barcontainers.append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.date))
      .attr('width', x.rangeBand())
      .attr('y', (d) => y(d.occurences))
      .attr('height', (d) => height - y(d.occurences));
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
      .on('mousemove', mousemove)
      .on('click', mouseclick);

    const x = d3.time.scale()
      .range([0, width]);

    const y = d3.scale.linear()
      .range([height, 0]);

    // x.domain(data.map(function(d) { return d.date; }));
    x.domain(d3.extent(data, (d) => d.date));
    y.domain([0, d3.max(data, (d) => d.occurences)]);
    // y.domain(d3.extent(data, function(d) {
    //     return d.close;
    // }));

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      // .tickValues(x.domain().filter(function(d, i) { return !(i % 5); }))
      .tickFormat(SI.timeFormat('%b %y'));

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left');

    svg.append('g')
      .attr('class', 'x axis bigdata')
      .attr('transform', `translate(0,${  height  })`)
      .call(xAxis);

    const line = d3.svg.line()
      .x((d) => 
        // console.log('date' + x(d.date));
         x(d.date))
      .y((d) => 
        // console.log(d);
        // console.log(y(d.occurences));
         y(d.occurences));

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
          focus.attr('transform', `translate(${  x(d.date)  },${  y(d.occurences)  })`);
        } else if (i < 3) {
          focus.attr('transform', `translate(${  x(data[2].date)  },${  y(d.occurences)  })`);
        } else {
          focus.attr('transform', `translate(${  x(data[data.length - 4].date)  },${  y(d.occurences)  })`);
        }

        focus.select('text').text(`${SI.timeFormat('%B %Y')(d.date)} | ${d.occurences}`);
      }
    }

    function mouseclick() {
      const x0 = x.invert(d3.mouse(this)[0] - margin.left);
      const i = bisectDate(data, x0, 1);
      const d0 = data[i - 1];
      const d1 = data[i];
      if (i < data.length) {
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;

        const circle = x0 - d0.date > d1.date - x0 ? d3.selectAll('.dot circle')[0][i] : d3.selectAll('.dot circle')[0][i - 1];

        // if (d3.select(circle).classed('hovered')) {

        // } else {
        //   d3.select('.dot circle.hovered')
        //     .classed('hovered', false)
        //     .transition()
        //     .duration(200)
        //     .attr('r', 4);

        //   d3.select(circle)
        //     .classed('hovered', true)
        //     .transition()
        //     .duration(200)
        //     .ease('linear')
        //     .attr('r', 7);
        // }

        // if (i > 2 && i < data.length - 3.5) {
        //   focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d.occurences) + ')');
        // } else if (i < 3) {
        //   focus.attr('transform', 'translate(' + x(data[2].date) + ',' + y(d.occurences) + ')');
        // } else {
        //   focus.attr('transform', 'translate(' + x(data[data.length - 4].date) + ',' + y(d.occurences) + ')');
        // }

        // focus.select('text').text(`${SI.timeFormat('%B %Y')(d.date)  } | ${  d.occurences}`);
        // time_query['time_filter'] = d3.select.cirle.datum();
        var thedate = d3.select(circle).datum().date;
        var filterdate = '1.' + String(thedate.getMonth() + 1) + '.' + String(thedate.getFullYear());
        console.log(filterdate);
        time_query['time_filter'] = filterdate;
        document.location.href = generateSearchUrl(time_query);
      }
    }

    svg.selectAll('g.dot')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'dot')
      .append('circle')
      .attr('r', 4)
      .attr('cx', (d, i) => 
        // console.log(d.date);
         x(d.date))
      .attr('cy', (d, i) => y(d.occurences))
      .on('mouseover', (d) => { // setup tooltip
        tooltipdiv.transition()
          .duration(200)
          .style('opacity', 0.9);

        // console.log($(this).parents('#kompas-scatter')));
        tooltipdiv.html(d.occurences)
          .style('left', (`${d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('.timechart').offset().left + 10}px`))
          .style('top', `${d3.event.pageY - $('.timechart').offset().top - 30}px`);

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

  $(`#smalldata${randomId}`).on('click', toggleTabAndExecuteCallback(() => createSmallChart(smalldata)));
  $(`#bigdata${randomId}`).on('click', toggleTabAndExecuteCallback(() => createLineChart(bigdata)));

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})(/* SCRIPT_PARAMS */);
