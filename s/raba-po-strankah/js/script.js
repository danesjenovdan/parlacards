let pg_query;
if (typeof query !== 'undefined') {
  pg_query = query;
} else {
  if (typeof customUrl !== 'undefined') {
    pg_query = getQueryParams(customUrl.split('?')[1]);
    pg_query['q'] = customUrl.split('/').pop().split('?')[0];
  } else {
    pg_query = {
      q: document.location.href.split('?q=')[1]
    };
  }
}

function getQueryParams(str) {
  return (str || document.location.search).replace(/(^\?)/, '').split('&').map(function (n) {
    return n = n.split('='), this[n[0]] = n[1], this;
  }.bind({}))[0];
}

function generateSearchUrl(queryParams) {
  let searchurl = 'https://parlameter.si/seje/isci/filter/?q=' + pg_query.q;
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

$.getJSON('https://data.parlameter.si/v1/getAllPGsExt/', function (response) {

  var parties = response;

  var dates = [];
  for (var i in parties) {
    if (parties[i]['acronym'] === 'PS NP') {
      dates.push(new Date(response[i]['founded']))
    }
  }
  var maxDate = new Date(Math.max.apply(null, dates));
  // for (i in dates) {
  //     if dates[i]
  // }

  // $.getJSON('https://isci.parlameter.si/q/zdravstvo', function(r) {
  var raw_data = stranke_data['facet_counts']['facet_fields']['party_i'];
  var sum = 0;
  for (var datum in raw_data) {
    if (datum % 2 == 1) {
      sum = sum + raw_data[datum];
    }
  }

  var date_formatter = d3.time.format('%Y-%m-%dT%H:%M:%SZ');

  var data = []

  var ticks = []

  var firstpiece, secondpiece;
  for (var piece in raw_data) {
    if (piece % 2 === 0) {
      firstpiece = raw_data[piece];
    } else {
      secondpiece = raw_data[piece];
      data.push({
        'party': firstpiece,
        'occurences': secondpiece,
        'percentage': isNaN(secondpiece / sum) ? 0 : Math.round(secondpiece / sum * 100)
      });
    }
  }

  var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
  };
  var width = 400 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;
  var radius = Math.min(width, height) / 2;

  var color = d3.scale.ordinal()
    .range(["#8FCFEE", "#4FB5E6", "#AA7375", "#534961", "#4F6379", "#5388AA", "#D9776B", "#BA594C"]);

  var arc = d3.svg.arc()
    .outerRadius(radius - 30)
    .innerRadius(0);


  var labelArc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 100);


  var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
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
    .style('fill', function (d) {
      return color(d.data.party);
    })
    .on('click', function (d) {
      pg_query['parties'] = d.data.party;
      document.location.href = generateSearchUrl(pg_query);
    });

  var labels = svg.selectAll("text").data(piedata)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", function (d) {
      var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
      d.cx = Math.cos(a) * (radius - 75);
      return d.x = Math.cos(a) * (radius + 20);
    })
    .attr("y", function (d) {
      var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
      d.cy = Math.sin(a) * (radius - 75);
      return d.y = Math.sin(a) * (radius + 20);
    })
    .text(function (d) {
      if (parties[d.data.party]) {
        return parties[d.data.party]['acronym'] + ' | ' + d.data.percentage + ' %';
      } else {
        return 'Zunanji govorci | ' + d.data.percentage + ' %';
      }
    })
    .style('display', function (d) {
      if (+d.data.percentage === 0) {
        return 'none';
      } else {
        return 'block';
      }
    })
    .classed('partylabel', true)
    .on('click', function (d) {
      pg_query['parties'] = d.data.party;
      document.location.href = generateSearchUrl(pg_query);
    });

  var alpha = 0.5;
  var spacingY = 20;
  var spacingX = 20;

  function relax() {

    var again = false;
    labels.each(function (d, i) {
      var a = this;
      var da = d3.select(a);
      var y1 = da.attr('y');
      var x1 = da.attr('x');

      labels.each(function (d, j) {
        var b = this;
        if (a == b) return;
        var db = d3.select(b);
        var y2 = db.attr('y');
        var x2 = db.attr('x');

        var deltaY = y1 - y2;
        var deltaX = x1 - x2;

        // handle Y spacing
        if (Math.abs(deltaY) > spacingY) {
          return;
        } else {
          // if we didn't break until now, labels are overlapping
          again = true;
          var sign = deltaY > 0 ? 1 : -1;
          var adjust = sign * alpha;
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
      // drawLines();
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

    labels.each(function (d) {
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
      .attr("d", function (d) {
        if (d.cx > d.ox) { //|| Math.abs(d.cx) < 0.1) {
          return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
        } else {
          if ((d.endx > 0) && (Math.abs(d.cx) < 10)) {
            return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
          }
          return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
        }
      })
      .style('display', function (d) {
        if (+d.data.percentage === 0) {
          return 'none';
        } else {
          return 'block';
        }
      });
  }

  // });

});

// function type(d) {
//     d.date = parseDate.parse(d.date);
//     d.occurences = +d.occurences;
//     return d;
// }

makeEmbedSwitch();
activateCopyButton();
addCardRippling();