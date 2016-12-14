if (!isMSIE) {

const openOption = false;

// utilities
  function groupBy(array, f) {
    const groups = {};
    array.forEach((o) => {
        const group = JSON.stringify(f(o));
    groups[group] = groups[group] || [];
    groups[group].push(o);
  });
    return Object.keys(groups).map((group) => groups[group]);
  }

// draw the pie
  function drawPie(data) {
    const arc = d3.svg.arc()
        .outerRadius(radius * 2 - 10);

    const labelArc = d3.svg.arc()
        .outerRadius(radius * 1.5 - 50)
        .innerRadius(radius * 1.5 - 100);

    const pie = d3.layout.pie()
        .sort(null)
        .value((d) => d.mps.length);

    const piedata = pie(data);

    const g = svg.selectAll('.arc')
        .data(piedata)
        .enter()
        .append('g')
        .classed('arc', true);

    g.append('path')
        .attr('d', arc)
        .attr('class', (d) => {
            const optionstring = ((d.data.option === 'not_present') ? 'ni' : d.data.option);
          return `${d.data.option }-arc ${ optionstring}-fill`;
        })
        // .style('fill', function(d) {
        //     return color(d.data.option);
        // })
        .style('stroke', (d) => color(d.data.option))
        .style('stroke-width', 0)
        .on('mouseover', (d) => {
          if (!d3.selectAll(`.${ d.data.option}-arc`).classed('hover')) { // current selection has no hover
                // hide option labels
            d3.selectAll('.label-option')
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
            d3.selectAll('.pointer-option')
                    .transition()
                    .duration(300)
                    .style('opacity', 0);

                // show party labels
            d3.selectAll(`.${d.data.option}-label-party`)
                    .transition()
                    .duration(300)
                    .style('opacity', 1);
            d3.selectAll(`.${ d.data.option }-pointer-party`)
                    .transition()
                    .duration(300)
                    .style('opacity', 1);

                // translate slices
            d3.selectAll(`.${d.data.option}-arc`)
                    .classed('hover', true)
                    .transition()
                    .duration(300)
                    .attrTween('transform', (d) => {
                        const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        const endTranslateState = `translate(${Math.cos(a) * (radius * 0.05)},${ Math.sin(a) * (radius * 0.05) })`;
                      return d3.interpolateString('translate(0, 0)', endTranslateState);
                    });
          }
        })
        .on('mouseleave', (d) => {
          if (!d3.selectAll(`.${d.data.option}-arc`).classed('active')) { // current selection is not active

                // return all slices from group
            d3.selectAll(`.${ d.data.option }-arc`)
                    .classed('hover', false)
                    .transition()
                    .duration(300)
                    .attrTween('transform', (d) => {
                        const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        const endTranslateState = `translate(${Math.cos(a) * (radius * 0.05) },${ Math.sin(a) * (radius * 0.05) })`;
                      return d3.interpolateString(endTranslateState, 'translate(0, 0)');
                    });

                // hide current party labels
            d3.selectAll(`.${ d.data.option.replace(' ', '_') }-label-party`)
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
                // hide current party pointers
            d3.selectAll(`.${ d.data.option.replace(' ', '_')}-pointer-party`)
                    .transition()
                    .duration(300)
                    .style('opacity', 0);

            if (d3.selectAll('path.active')[0].length === 0) { // no selection is active
                    // show labels
                d3.selectAll('.label-option')
                        .transition()
                        .duration(300)
                        .style('opacity', 1);
                d3.selectAll('.pointer-option')
                        .transition()
                        .duration(300)
                        .style('opacity', 1);
              }
          }
        })
        .on('click', function (d) {
            // stop propagation
          d3.event.stopPropagation();
          console.log('ping');

          if (d3.selectAll('.active')[0].length === 0) {
 // no selection is active

            d3.selectAll(`.${ d.data.option}-arc`)
                    .classed('active', true);

                // togle mps
            d3.selectAll('.mpgroup').classed('hidden', true);
            var mp_list = d3.selectAll(`.${ d.data.option}`);
            mp_list.classed('hidden', false);
          } else if (d3.selectAll(`.${ d.data.option }-arc`).classed('active')) { // current selection is ac
              tive;

              if (d3.select(this).classed('chosen')) {
 // clicked slice is chosen

                    // move slice back
                d3.select(this)
                        .classed('chosen', false)
                        .transition()
                        .duration(300)
                        .attrTween('transform', (d) => {
                            const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            const startTranslateState = `translate(${Math.cos(a) * (radius * 0.1)},${ Math.sin(a) * (radius * 0.1)})`;
                            const endTranslateState = `translate(${ Math.cos(a) * (radius * 0.05) },${ Math.sin(a) * (radius * 0.05) })`;
                          return d3.interpolateString(startTranslateState, endTranslateState);
                        });

                    // toggle mps
                d3.selectAll('.mpgroup').classed('hidden', true);
                var mp_list = d3.selectAll(`.${d.data.option}`);
                mp_list.classed('hidden', false);
              } else {
 // clicked slice is not chosen

                    // demote currently chosen slices
                d3.selectAll('path.chosen')
                        .classed('chosen', false)
                        .transition()
                        .duration(300)
                        .attrTween('transform', (d) => {
                            const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            const startTranslateState = `translate(${Math.cos(a) * (radius * 0.1) },${ Math.sin(a) * (radius * 0.1)})`;
                            const endTranslateState = `translate(${ Math.cos(a) * (radius * 0.05) },${ Math.sin(a) * (radius * 0.05) })`;
                          return d3.interpolateString(startTranslateState, endTranslateState);
                        });

                    // move slice further
                d3.select(this)
                        .classed('chosen', true)
                        .transition()
                        .duration(300)
                        .attrTween('transform', (d) => {
                            const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            const startTranslateState = `translate(${Math.cos(a) * (radius * 0.05) },${Math.sin(a) * (radius * 0.05)})`;
                            const endTranslateState = `translate(${Math.cos(a) * (radius * 0.1) },${ Math.sin(a) * (radius * 0.1)})`;
                          return d3.interpolateString(startTranslateState, endTranslateState);
                        });

                    // togle mps
                d3.selectAll('.mpgroup').classed('hidden', true);
                var mp_list = d3.select(`.${ d.data.option }.${ d.data.pg.acronym.replace(' ', '_')}`);
                mp_list.classed('hidden', false);
              }
            } else {
 // other selection is active

              console.log('demote chosen');
                // demote currently chosen slices
              d3.selectAll('path.chosen')
                    .classed('chosen', false)
                    .transition()
                    .duration(300)
                    .attrTween('transform', (d) => {
                        const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                        const startTranslateState = `translate(${ Math.cos(a) * (radius * 0.1)},${Math.sin(a) * (radius * 0.1) })`;
                        const endTranslateState = `translate(${Math.cos(a) * (radius * 0.05) },${Math.sin(a) * (radius * 0.05)})`;
                      return d3.interpolateString(startTranslateState, endTranslateState);
                    });

              console.log('demote active');
                // demote currently active slices
              if (d3.select('path.active')[0][0] !== null) {
                    const activeOption = d3.select('path.active').datum().data.option;
                console.log(activeOption);
                d3.selectAll('path.active')
                        .classed('active', false)
                        .classed('hover', false)
                        .transition()
                        .delay(300)
                        .duration(300)
                        .attrTween('transform', (d) => {
                            const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                            const endTranslateState = `translate(${ Math.cos(a) * (radius * 0.05) },${ Math.sin(a) * (radius * 0.05)})`;
                          return d3.interpolateString(endTranslateState, 'translate(0, 0)');
                        });

                console.log('hide active');
                    // hide currently active party labels
                d3.selectAll(`.${activeOption.replace(' ', '_')}-label-party`)
                        .transition()
                        .duration(300)
                        .style('opacity', 0);
                    // hide current party pointers
                d3.selectAll(`.${ activeOption.replace(' ', '_') }-pointer-party`)
                        .transition()
                        .duration(300)
                        .style('opacity', 0);
              }

              console.log('select data.option');
              d3.selectAll(`.${ d.data.option}-arc`)
                    .classed('active', true);

              console.log('toggle mps');
                // togle mps
              d3.selectAll('.mpgroup').classed('hidden', true);
              var mp_list = d3.selectAll(`.${ d.data.option}`);
              mp_list.classed('hidden', false);
            }
        });
  }

// draw option labels
  function drawOptionLabels(data) {
    const pie = d3.layout.pie()
        .sort(null)
        .value((d) => d.total_votes);

    const piedata = pie(data);

    const labels = svg.selectAll('text.option-label').data(piedata)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', (d) => {
            const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
          d.cx = Math.cos(a) * (radius * 2 - 73);
          return d.x = Math.cos(a) * (radius * 2 + 25);
        })
        .attr('y', (d) => {
            const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
          d.cy = Math.sin(a) * (radius * 2 - 73);
          return d.y = Math.sin(a) * (radius * 2 + 25);
        })
        .attr('class', (d) => d.data.option + '-label-option')
        .classed('label-option', true)
        .classed('label', true)
        .text((d) => {
          let text = '';
          switch (d.data.option) {
            case 'kvorum':
              text = 'VZDRŽANI';
              break;
            case 'not_present':
              text = 'NISO';
              break;
            case 'for':
              text = 'ZA';
              break;
            case 'against':
              text = 'PROTI';
              break;
          }
          return `${text} | ${d.data.total_votes}`;
        })
        .each(function (d) {
            const bbox = this.getBBox();
          d.sx = d.x - bbox.width / 2 - 2;
          d.ox = d.x + bbox.width / 2 + 2;
          d.sy = d.oy = d.y + 5;
        });

    function drawLines(labels) {

    labels.each(function (d) {
            const thing = d3.select(this);
            const bbox = this.getBBox();
        d.sx = +thing.attr('x') - bbox.width / 2 - 2;
        d.ox = +thing.attr('x') + bbox.width / 2 + 2;
        d.sy = d.oy = +thing.attr('y') + 5;
        d.endx = +thing.attr('x') + bbox.width;
      });

    svg.selectAll('path.pointer.pointer-option').data(piedata).enter()
            .append('path')
            .attr('class', 'pointer')
            .classed('pointer-option', true)
            .style('fill', 'none')
            .attr('d', (d) => {
                const w = 2.1;

              if (d.cx > d.ox) { // || Math.abs(d.cx) < 0.1) {
                return `M${ d.sx },${d.sy}L${d.ox},${ d.oy} ${d.cx * w},${d.cy * w}`;
              } else {
                if ((d.endx > 0) && (Math.abs(d.cx) < 10)) {
                    return `M${ d.sx},${ d.sy}L${ d.ox },${ d.oy} ${ d.cx * w},${ d.cy * w}`;
                  }
                return `M${d.ox},${ d.oy}L${d.sx },${ d.sy} ${ d.cx * w },${ d.cy * w}`;
              }
            })
            .style('display', (d) => {
              if (+d.data.percentage === 0) {
                return 'none';
              } else {
                return 'block';
              }
            });
  }

    // drawLines(labels);
  }

// draw party labels
  function drawPartyLabels(data) {
    const pie = d3.layout.pie()
        .sort(null)
        .value((d) => d.mps.length);

    const piedata = pie(data);

    const labels = svg.selectAll('text.label-party').data(piedata)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('x', (d) => {
            const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
          d.cx = Math.cos(a) * (radius * 2 - 73);
          return d.x = Math.cos(a) * (radius * 2 + 25);
        })
        .attr('y', (d) => {
            const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
          d.cy = Math.sin(a) * (radius * 2 - 73);
          return d.y = Math.sin(a) * (radius * 2 + 25);
        })
        .attr('class', (d) => d.data.option + '-label-party')
        .classed('label-party', true)
        .classed('label', true)
        .text((d) => `${d.data.pg.acronym  } | ${  d.data.mps.length}`)
        .each(function (d) {
            const bbox = this.getBBox();
          d.sx = d.x - bbox.width / 2 - 2;
          d.ox = d.x + bbox.width / 2 + 2;
          d.sy = d.oy = d.y + 5;

            const w = 2.2;
          if (d.cx * w > d.sx && d.cy * w < d.sy && d.cx < 0) {
            d3.select(this).attr('x', (d) => d.x - Math.abs(d.cx * w - d.sx) / 3.5);
          }
          if ((d.cx * w > d.sx) && (d.cy < d.sy) && (d.cx < d.ox - 8)) {
            d3.select(this).attr('x', (d) => d.x + Math.abs(d.cx * w - d.sx));
          }
        });

    const alpha = 0.5;
    const spacingY = 20;
    const spacingX = 40;

    function relax(labels) {
    let again = false;
    labels.each(function (d, i) {
            const a = this;
            const da = d3.select(a);
            const y1 = da.attr('y');
            const x1 = da.attr('x');

        labels.each(function (d, j) {
            const b = this;
            if (a == b) return;
            const db = d3.select(b);
            const y2 = db.attr('y');
            const x2 = db.attr('x');

            const deltaY = y1 - y2;
            const deltaX = x1 - x2;

                // handle X & Y spacing
            if (Math.abs(deltaY) > spacingY || Math.abs(deltaX) > spacingX) {

              } else {
                    // if we didn't break until now, labels are overlapping
                again = true;

                let sign = deltaY > 0 ? 1 : -1;
                let adjust = sign * alpha;
                da.attr('y', +y1 + adjust);
                db.attr('y', +y2 - adjust);

                sign = deltaX > 0 ? 1 : -1;
                adjust = sign * alpha;
                da.attr('x', +x1 + adjust);
                db.attr('x', +x2 - adjust);
              }
          });
      });

    if (again) {
        setTimeout(relax(labels), 20);
      } else {
      }
  }


    const groupedData = groupBy(second_level_data, (item) => [item.option]);

    for (i in groupedData) {
        const group_of_labels = d3.selectAll(`.${ groupedData[i][0]['option']}-label-party`);
    relax(group_of_labels);
  }

    function drawLines(labels) {

    labels.each(function (d) {
            const thing = d3.select(this);
            const bbox = this.getBBox();
        d.sx = +thing.attr('x') - bbox.width / 2 - 2;
        d.ox = +thing.attr('x') + bbox.width / 2 + 2;
        d.sy = d.oy = +thing.attr('y') + 5;
        d.endx = +thing.attr('x') + bbox.width;
      });

    svg.selectAll('path.pointer-party').data(piedata).enter()
            .append('path')
            .attr('class', (d) => d.data.option + '-pointer-party')
            .classed('pointer', true)
            .classed('pointer-party', true)
            .style('fill', 'none')
            .attr('d', (d) => {
                const w = 2.2;

              if (d.cx > d.ox - 8) { // || Math.abs(d.cx) < 0.1) {
                    // if (d.cy < d.oy) {
                    //    console.log(d);
                    //    return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + (d.cx * w + 10) + "," + (d.cy * w + 10);
                    // }
                return `M${ d.sx},${d.sy}L${ d.ox},${ d.oy } ${ d.cx * w},${ d.cy * w}`;
              } else {
                if ((d.endx > 0) && (Math.abs(d.cx) < 10)) {
                    return `M${d.sx},${ d.sy}L${ d.ox},${ d.oy} ${ d.cx * w},${ d.cy * w}`;
                  }
                return `M${ d.ox },${ d.oy}L${ d.sx},${ d.sy } ${ d.cx * w},${d.cy * w}`;
              }
            })
            .style('display', (d) => {
              if (+d.data.percentage === 0) {
                return 'none';
              } else {
                return 'block';
              }
            });
  }

    // drawLines(labels);
  }

// initial setup
const margin = {
  top: 50,
  right: 80,
  bottom: 50,
  left: 80,
};
const width = 400 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
  let radius = Math.min(width, height) / 4.5;

  let color = d3.scale.ordinal()
    .range(['#009CDD', '#00628C', '#99E1FF', '#003B54']);

  let svg = d3.select('.layeredchart').append('svg')
    .attr('viewBox', '0 0 400 400')
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .on('click', () => {
        // hide option labels
      d3.selectAll('.label-option')
            .transition()
            .duration(300)
            .style('opacity', 0);
      d3.selectAll('.pointer-option')
            .transition()
            .duration(300)
            .style('opacity', 0);

        // show mps
      d3.selectAll('.mpgroup')
            .classed('hidden', false);

        // translate currently active slices and hide labels of active elements
        // hide other party labels
      d3.selectAll('.label-party')
            .transition()
            .duration(300)
            .style('opacity', 0);
      d3.selectAll('.pointer-party')
            .transition()
            .duration(300)
            .style('opacity', 0);
        // demote currently chosen slices
      d3.selectAll('path.chosen')
            .classed('chosen', false)
            .transition()
            .duration(300)
            .attrTween('transform', (d) => {
                const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                const startTranslateState = `translate(${ Math.cos(a) * (radius * 0.1) },${ Math.sin(a) * (radius * 0.1)})`;
                const endTranslateState = `translate(${ Math.cos(a) * (radius * 0.05) },${ Math.sin(a) * (radius * 0.05) })`;
              return d3.interpolateString(startTranslateState, endTranslateState);
            });
        // demote currently active slices
      d3.selectAll('path.active')
            .classed('hover', false)
            .classed('active', false)
            .transition()
            .delay(300)
            .duration(300)
            .attrTween('transform', (d) => {
                const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                const endTranslateState = `translate(${ Math.cos(a) * (radius * 0.05) },${Math.sin(a) * (radius * 0.05) })`;
              return d3.interpolateString(endTranslateState, 'translate(0, 0)');
            });

        // show labels
      d3.selectAll('.label-option')
            .transition()
            .duration(300)
            .style('opacity', 1);
      d3.selectAll('.pointer-option')
            .transition()
            .duration(300)
            .style('opacity', 1);
    })
    .append('g')
    .attr('transform', `translate(${  width / 2 + margin.left  },${  height / 2 + margin.top  })`);

  let second_level_data = [];
  for (const option in data.all) {
    for (const party in data.all[option].breakdown) {
        const newdict = data.all[option].breakdown[party];
    newdict.option = option;

    second_level_data.push(newdict);
  }
  }

const option_data = [];
  for (var i in data.all) {
    option_data.push(data.all[i]);
  }

  drawPie(second_level_data);
  drawOptionLabels(option_data);
  drawPartyLabels(second_level_data);


  function moveSingleMP() {
    const mp_list = d3.select(`.${ d.data.option}.${d.data.pg.acronym.replace(' ', '_')}`);

    mp_list.classed('hidden', !mp_list.classed('hidden'));

    _this = d3.select(this);

    if (_this.classed('selected')) {
    _this.attr('transform', (d) => 'translate(0, 0)')
                    .classed('selected', false);
  } else {
    _this.attr('transform', (d) => {
                        const a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
                return `translate(${Math.cos(a) * (radius * 0.2)},${Math.sin(a) * (radius * 0.2) })`;
              })
                    .classed('selected', true);
  }
  }

  $('.option').on('click', function () {
    // togle mps
    $('.mpgroup').addClass('hidden');
    console.log($(this).data('option'));
    $(`.mpgroup.${ $(this).data('option')}`).removeClass('hidden');
  });
} else {
  $('.card-glasovanje-layered .card-content-front').html('<div class="no-results" style="width: 300px; margin-top: -20px;">Tvoj brskalnik žal ne podpira tehnologij, ki poganjajo to kartico.</div>');
}

makeEmbedSwitch();
activateCopyButton();
addCardRippling();
