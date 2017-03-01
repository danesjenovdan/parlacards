/*
  global $ makeEmbedSwitch
  activateCopyButton addCardRippling navigator
  d3 window document urlsData prisotnostData
*/

(() => {
  const data = prisotnostData.results;
  const dateFormatter = d3.time.format('%Y-%m-%dT%H:%M:%S');
  data.sort((x, y) => dateFormatter.parse(x.date_ts) - dateFormatter.parse(y.date_ts));

  // global stuff for the chart
  const margin = {
    top: 10,
    right: 30,
    bottom: 30,
    left: 40,
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

  const parseDate = d3.time.format('%Y-%m-%dT%H:%M:%S').parse;
  const bisectDate = d3.bisector(d => d.date).left;

  // preparing data for d3 consumption
  const manipulatedData = data.map((d) => {
    return {
      date: parseDate(d.date_ts),
      presence: +d.presence,
      // notMember: +d.not_member,
    };
  });

  // preparing data for d3 stack consumption
  const presentData = data.map((d) => {
    return {
      x: parseDate(d.date_ts),
      y: +d.presence,
    };
  });
  // const notMemberData = data.map((d) => {
  //   return {
  //     x: parseDate(d.date_ts),
  //     y: +d.not_member,
  //   };
  // });
  const notPresentData = data.map((d) => {
    return {
      x: parseDate(d.date_ts),
      y: 100 - d.presence,
    };
  });
  const layers = [{
    name: 'present',
    values: presentData,
  }, {
    name: 'notPresent',
    values: notPresentData,
  },
  //, {
  //   name: 'notMember',
  //   values: notMemberData,
  // }
  ];

  const svg = d3.select('.prisotnost-chart').append('svg')
    .attr('class', 'prisotnostchart')
    .attr('viewBox', '0 0 960 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  function renderBarChart(data) {
    const x = d3.scale.ordinal().rangeRoundBands([0, width]);

    const y = d3.scale.linear()
      .range([height, 0]);

    // barchart domains
    x.domain(data.map(d => d.date));
    y.domain([0, 100]);

    const xAxis = d3.svg.axis()
      .scale(x)
      .orient('bottom')
      // .tickValues(x.domain().filter(function(d, i) { return !(i % 5); }))
      .tickFormat(SI.timeFormat('%b %y'));

    const yAxis = d3.svg.axis()
      .scale(y)
      .orient('left')
      .tickValues([0, 25, 50, 75, 100])
      .tickFormat(d => `${d} %`)
      .innerTickSize(-(width - 13))
      .outerTickSize(0);

    const line = d3.svg.line()
      .x(d => x(d.x))
      .y(d => y(d.y));

    // create stack
    const stack = d3.layout.stack()
      .values(d => d.values);
    const area = d3.svg.area()
      .interpolate('step')
      .x(d => x(d.x))
      .y0(d => y(d.y0))
      .y1(d => y(d.y0 + d.y));
    const colors = ['blue', 'red', 'green'];
    const color = d3.scale.ordinal().range(colors);

    const presencething = svg.selectAll('.presencething')
      .data(stack(layers))
      .enter()
      .append('g')
      .attr('class', d => `presencething-${d.name}`);

    presencething.selectAll('rect')
      .data(d => {
        return d.values;
      })
      .enter()
      .append('rect')
      .attr('x', d => {
        return x(d.x);
      })
      .attr('y', d => {
        return y(d.y + d.y0);
      })
      .attr('data-time', d => d.x)
      .attr('height', d => y(d.y0) - y(d.y + d.y0))
      .attr('width', x.rangeBand())
      .on('mouseover', (d) => {
        const bars = svg.selectAll('rect[data-time="' + d.x + '"]').classed('hovered', true);
        console.log(x(d.x));
        if (x(d.x) < 14) {
          focus.attr('transform', `translate(${x(d.x) + 110},${y(80)})`)
            .style('display', null)
            .selectAll('text')
            .remove();
        } else if (x(d.x) > 748) {
          focus.attr('transform', `translate(${x(d.x) - 70},${y(80)})`)
          .style('display', null)
          .selectAll('text')
          .remove();
        } else {
          focus.attr('transform', `translate(${x(d.x) + 110},${y(80)})`)
          .style('display', null)
          .selectAll('text')
          .remove();
        }

        focus.append('text')
          .text(SI.timeFormat('%B %Y')(d3.select(bars[0][0]).datum().x))
          .style('fill', '#ffffff')
          .attr('text-anchor', 'start')
          .attr('x', -70)
          .attr('y', -18);
        focus.append('text')
          .text(`Prisotni | ${Math.round(d3.select(bars[0][0]).datum().y)} %`)
          .style('fill', '#ffffff')
          .attr('text-anchor', 'start')
          .attr('x', -70)
          .attr('y', 10);
        focus.append('text')
          .text(`Odsotni | ${Math.round(d3.select(bars[0][1]).datum().y - 0.0000000001)} %`) // odštevamo zaradi case-a 20.5 + 79.5
          .style('fill', '#ffffff')
          .attr('text-anchor', 'start')
          .attr('x', -70)
          .attr('y', 28);
        focus.append('text')
          .text(`Brez mandata | ${Math.round(d3.select(bars[0][2]).datum().y)} %`)
          .style('fill', '#ffffff')
          .attr('text-anchor', 'start')
          .attr('x', -70)
          .attr('y', 46);

        // focus
        //   .append('text')
        //   .text(`${SI.timeFormat('%B %Y')(d.x)} | ${d.y.toFixed(2)}`)
        //   .style('fill', '#ffffff')
        //   .attr('text-anchor', 'middle')
        //   .attr('y', -18);
      })
      .on('mouseleave', d => {
        const bars = svg.selectAll('rect[data-time="' + d.x + '"]').classed('hovered', false);
        focus.style('display', 'none');
      });

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
          focus.attr('transform', `translate(${x(d.date)},${y(d.presence)})`);
        } else if (i < 3) {
          focus.attr('transform', `translate(${x(data[2].date)},${y(d.presence)})`);
        } else {
          focus.attr('transform', `translate(${x(data[data.length - 4].date)},${y(d.presence)})`);
        }

        focus.select('text').text(`${SI.timeFormat('%B %Y')(d.date)} | ${d.presence.toFixed(2)}`);
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

        // search url generation
        // var thedate = d3.select(circle).datum().date;
        // var filterdate = '1.' + String(thedate.getMonth() + 1) + '.' + String(thedate.getFullYear());
        // console.log(filterdate);
        // time_query['time_filter'] = filterdate;
        // document.location.href = generateSearchUrl(time_query);
      }
    }

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(0,0)`)
      .call(yAxis);

    let focus = svg.append('g')
      .attr('class', 'focus')
      .style('display', 'none');

    focus.append('rect')
      .attr('width', 140)
      .attr('height', 90)
      .attr('y', -35)
      .attr('x', -75)
      .style('rx', 3)
      .style('yx', 3);

    focus.append('rect')
      .attr('width', 130)
      .attr('height', 1.5)
      .attr('y', -9)
      .attr('x', -70)
      .style('fill', '#ffffff');

    // dots
    // svg.selectAll('g.dot')
    //   .data(data)
    //   .enter()
    //   .append('g')
    //   .attr('class', 'dot')
    //   .append('circle')
    //   .attr('r', 4)
    //   .attr('cx', (d, i) =>
    //     // console.log(d.date);
    //      x(d.date))
    //   .attr('cy', (d, i) => y(d.presence))
    //   .on('mouseover', (d) => { // setup tooltip
    //     tooltipdiv.transition()
    //       .duration(200)
    //       .style('opacity', 0.9);

    //     // console.log($(this).parents('#kompas-scatter')));
    //     tooltipdiv.html(d.presence)
    //       .style('left', (`${d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2) - $('.timechart').offset().left + 10}px`))
    //       .style('top', `${d3.event.pageY - $('.timechart').offset().top - 30}px`);

    //     // console.log('ping');
    //   })
    //   .on('mouseout', (d) => {
    //     tooltipdiv.transition()
    //       .duration(200)
    //       .style('opacity', 0);
    //   });
  }

  renderBarChart(manipulatedData);
})(/*SCRIPT PARAMS */);
