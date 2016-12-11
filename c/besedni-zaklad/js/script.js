/*
  global $ vocabsize_state makeEmbedSwitch
  activateCopyButton addCardRippling navigator
  d3 window measure searchpeople Bloodhound
  parties_data document urlsData data
*/

if (Object.keys(vocabsize_state).length === 0) {
  vocabsize_state.people = [];
  vocabsize_state.parties = [];
}

let isMSIE = false;

if (navigator.appName === 'Microsoft Internet Explorer' || !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))) {
  isMSIE = true;
}

(() => {
  // Define the div for the tooltip
  const tooltipdiv = d3.select('#vocabulary-chart').append('div')
    .attr('class', 'besedni-zaklad-tooltip');

  const margin = {
    top: 50,
    right: 300,
    bottom: 50,
    left: 50,
  };
  const outerWidth = 1050;
  const outerHeight = 500;
  const width = outerWidth - margin.left - margin.right;
  const height = outerHeight - margin.top - margin.bottom;

  const x = d3.scale.linear()
    .range([margin.left, width]).nice();

  const localData = data.map((d) => {
    const newD = d;
    newD.score = +newD.score;
    return newD;
  });

  const xMax = d3.max(localData, d => d.score) * 1.05;
  const xMin = d3.min(localData, d => d.score);

  x.domain([xMin, xMax]);

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('top')
    .tickSize(380);

  const svg = d3.select('#vocabulary-chart')
    .append('svg')
    .attr('viewBox', '0 0 700 400')
    .attr('preserveAspectRatio', 'xMidYMid meet');

  svg.append('g')
    .classed('x axis', true)
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

  const nodes = localData.map((node) => {
    const newNode = {
      person: node.person,
      score: node.score,
      idealradius: node.score / 100,
      radius: 15,
      // Set the node's gravitational centerpoint.
      idealcx: x(node.score),
      idealcy: height / 2,
      x: x(node.score),
      // Add some randomization to the placement;
      // nodes stacked on the same point can produce NaN errors.
      y: (height / 2) + Math.random(),
    };

    return newNode;
  });

  function groupBy(array, f) {
    const groups = {};
    array.forEach((o) => {
      const group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(group => groups[group]);
  }

  const groupedNodes = groupBy(nodes, node => [node.person.party.acronym]);

  const objects = svg.append('svg')
    .classed('objects', true)
    .attr('width', width)
    .attr('height', height);

  objects.selectAll('g')
    .data(groupedNodes)
    .enter()
    .append('g')
    .attr('id', d => `bzGroup${d[0].person.party.acronym.replace(' ', '_')}`);


  function updateEmbedURL() {
    const textareaValBase = $('.card-besedni-zaklad .embed-script textarea').val().split('100&" src="')[0];
    const embedbase = `${textareaValBase}100%" src="`;
    const encodedState = encodeURIComponent(JSON.stringify(vocabsize_state));
    const embedextra = `https://glej.parlameter.si/c/besedni-zaklad-vsi/?embed=true&altHeader=true&state=${encodedState}">`;
    const embedcode = embedbase + embedextra;
    $('.card-besedni-zaklad .embed-script textarea').val(embedcode);
  }

  function updateShareURL() {
    const encodedState = encodeURIComponent(JSON.stringify(vocabsize_state));
    $('.card-besedni-zaklad .share-url').val(`https://glej.parlameter.si/c/besedni-zaklad-vsi/?frame=true&altHeader=true&state=${encodedState}`);
    $('.card-besedni-zaklad .card-footer').data('shortened', 'false');
    updateEmbedURL();
  }

  function pushParty(dashAcronym) {
    if (vocabsize_state.parties.indexOf(dashAcronym) === -1) {
      vocabsize_state.parties.push(dashAcronym);
    }
    updateShareURL();
  }

  function updatePeopleScroller() {
    window.setTimeout(() => {
      let thewidth = 0;

      $('.besedni-zaklad-person')
        .not('.hidden')
        .each((i, e) => {
          thewidth = thewidth + $(e).outerWidth() + 21;
        });

      $('.besedni-zaklad-people-wide')
        .width(thewidth);
    }, 10);
  }

  function exposeMe(datum) {
    if (!$('#vocabulary-chart').hasClass('selection-active')) {
      $('#vocabulary-chart').addClass('selection-active');
    }

    const clickedElement = svg.select(`#_${datum.person.id}`);

    // state search
    function hasID(element) {
      return element.id === datum.person.id;
    }

    const elementfound = vocabsize_state.people.find(hasID);

    if (!clickedElement.classed('selected')) {
      if (!elementfound) {
        vocabsize_state.people.push({
          id: parseInt(datum.person.id, 10),
          name: datum.person.name,
        });
      }
      updateShareURL();

      clickedElement.classed('selected', true);
      $(`#personcard${datum.person.id}`).removeClass('hidden');
      if (typeof measure === 'function') {
        measure('besedni-zaklad', 'person', datum.person.name, '');
      }
    } else {
      if (elementfound) {
        vocabsize_state.people.splice(vocabsize_state.people.indexOf(elementfound), 1);
      }
      updateShareURL();

      clickedElement.classed('selected', false);
      $(`#personcard${datum.person.id}`).addClass('hidden');
      // if all party members are hidden, disable partyswitch
      const underscoreAcronym = datum.person.party.acronym.replace(/ /g, '_');
      const classAcronym = underscoreAcronym.toLowerCase();

      if (svg.selectAll(`.${classAcronym}-stroke.selected`)[0].length === 0) {
        const hoverclassname = `${classAcronym}-hover`;
        const backgroundclassname = `${classAcronym}-background`;
        $(`#besedni-zaklad-partyswitch-${underscoreAcronym}`)
          .removeClass('turnedon');
        // $(`#besedni-zaklad-partyswitch-${underscoreAcronym}`)
        //   .addClass(hoverclassname);
        $(`#besedni-zaklad-partyswitch-${underscoreAcronym}`)
          .removeClass(backgroundclassname);
      }
    }

    if ($('.dot.selected').length === 0) {
      $('#vocabulary-chart').removeClass('selection-active');
    }

    updatePeopleScroller();
  }

  function exposeHer(datum) {
    if (!$('#vocabulary-chart').hasClass('selection-active')) {
      $('#vocabulary-chart').addClass('selection-active');
    }

    const clickedElement = svg.select(`#_${datum.id}`);
    if (!clickedElement.classed('selected')) {
      clickedElement.classed('selected', true);
      $(`#personcard${datum.id}`).removeClass('hidden');
      if (typeof measure === 'function') {
        measure('besedni-zaklad', 'person', datum.name, '');
      }
    } else {
      clickedElement.classed('selected', false);
      $(`#personcard${datum.id}`).addClass('hidden');
    }

    if ($('.dot.selected').length === 0) {
      $('#vocabulary-chart').removeClass('selection-active');
    }

    updatePeopleScroller();
  }

  const poslancisearch = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: searchpeople,
  });

  const skupinesearch = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('acronym', 'name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: parties_data,
  });

  function removeSearchPerson(datum) {
    searchpeople.forEach((searchperson, personI) => {
      if (searchperson.name === datum.name) {
        searchpeople.splice(personI, 1);
      }
    });

    poslancisearch.local = searchpeople;
    poslancisearch.initialize(true);
  }

  function addSearchPerson(datum) {
    searchpeople.push(datum);
    poslancisearch.local = searchpeople;
    poslancisearch.initialize(true);
  }

  function updatePeopleSearch() {
    $('.besedni-zaklad-search-input').typeahead({}, {
      // 'limit': 3,
      name: 'poslanci',
      display: 'name',
      source: poslancisearch,
      templates: {
        empty: '<div class="searchheader results">POSLANKE IN POSLANCI</div><div class="searchperson-container">Ni zadetkov.</div>',
        suggestion: datum => `<div class="searchperson-container"><div class="avgminimg img-circle" style="width: 40px; height: 40px; background-image: url('https://cdn.parlameter.si/v1/parlassets/img/people/square/${datum.gov_id}.png'); background-size: cover;"></div>${datum.name}</div>`,
        header: '<div class="searchheader">POSLANKE IN POSLANCI</div>',
      },
    }, {
      // 'limit': 3,
      name: 'skupine',
      display: 'acronym',
      source: skupinesearch,
      templates: {
        empty: '<div class="searchheader results">POSLANSKE SKUPINE</div><div class="searchperson-container">Ni zadetkov.</div>',
        suggestion: datum => `<div class="searchperson-container"><div class="avgminimg avgminimg-party img-circle" style="width: 40px; height: 40px;"></div>${datum.acronym}</div>`,
        header: '<div class="searchheader results">POSLANSKE SKUPINE</div>',
      },
    });

    $('.besedni-zaklad-search-input').bind('typeahead:select', (e, datum) => {
      if (datum.acronym) {
        const underscoreAcronym = datum.acronym.replace(/ /g, '_');
        $(`#besedni-zaklad-partyswitch-${underscoreAcronym}`).click();
        if (typeof measure === 'function') {
          measure('besedni-zaklad', 'party', datum.acronym, '');
        }
      } else {
        exposeHer(datum);
        removeSearchPerson(datum);
        if (typeof measure === 'function') {
          measure('besedni-zaklad', 'person', datum.name, '');
        }
      }

      $('.besedni-zaklad-search-input').typeahead('close').typeahead('val', '');
    });
  }

  function makeSwitchEvent(acronym) {
    const underscoreAcronym = acronym.replace(/ /g, '_');
    $(`#besedni-zaklad-partyswitch-${underscoreAcronym}`).on('click', (event) => {
      const partymemberDots = svg.select(`#bzGroup${underscoreAcronym}`).selectAll('.dot');
      const dashAcronym = acronym.replace(/ /g, '-').toLowerCase();

      if (!$(event.currentTarget).hasClass('turnedon')) { // !.turnedon
        pushParty(dashAcronym);

        $(event.currentTarget).addClass(`${underscoreAcronym.toLowerCase()}-background`);
        partymemberDots.classed('selected', true);
        $('#vocabulary-chart').addClass('selection-active');

        $(event.currentTarget).addClass('turnedon');

        partymemberDots.each((d) => {
          $(`#personcard${d.person.id}`).removeClass('hidden');
          updatePeopleScroller();
        });
        if (typeof measure === 'function') {
          measure('besedni-zaklad', 'party', acronym, '');
        }
      } else { // .turnedon
        if (vocabsize_state.parties.indexOf(dashAcronym) !== -1) {
          vocabsize_state.parties.splice(vocabsize_state.parties.indexOf(dashAcronym), 1);
        }
        updateShareURL();

        $(event.currentTarget).removeClass(`${underscoreAcronym.toLowerCase()}-background`);
        partymemberDots.classed('selected', false);
        $(event.currentTarget).removeClass('turnedon');

        if ($('.dot.selected').length === 0) {
          $('#vocabulary-chart').removeClass('selection-active');
        }

        partymemberDots.each((d) => {
          $(`#personcard${d.person.id}`).addClass('hidden');
          updatePeopleScroller();
        });
      }
    });
  }

  /**
   * On a tick, move the node towards its desired position,
   * with a preference for accuracy of the node's x-axis placement
   * over smoothness of the clustering, which would produce inaccurate data presentation.
   */
  function gravity(alpha) {
    return (d) => {
      const newD = d;
      newD.y += (d.idealcy - newD.y) * alpha;
      newD.x += (d.idealcx - newD.x) * alpha * 3;
      return newD;
    };
  }

  /**
   * On a tick, resolve collisions between nodes.
   */
  const maxRadius = 15;
  const padding = 5;

  function collide(alpha) {
    const quadtree = d3.geom.quadtree(nodes);
    return (d) => {
      const r = d.radius + maxRadius + padding;
      const nx1 = d.x - r;
      const nx2 = d.x + r;
      const ny1 = d.y - r;
      const ny2 = d.y + r;
      const newD = d;
      quadtree.visit((quad, x1, y1, x2, y2) => {
        const newQuad = quad;
        if (newQuad.point && (newQuad.point !== newD)) {
          let visitedX = newD.x - quad.point.x;
          let visitedY = newD.y - quad.point.y;
          let visitedL = Math.sqrt((visitedX * visitedX) + (visitedY * visitedY));
          const visitedR = newD.radius + quad.point.radius + padding;
          if (visitedL < visitedR) {
            visitedL = ((visitedL - visitedR) / visitedL) * alpha;

            newD.x -= (visitedX * visitedL);
            visitedX *= visitedL;

            newD.y -= (visitedY * visitedL);
            visitedY *= visitedL;

            newQuad.point.x += visitedX;
            newQuad.point.y += visitedY;
          }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
      });
      return d;
    };
  }

  /**
   * On a tick, apply custom gravity, collision detection, and node placement.
   */
  function tick(e) {
    for (let i = 0; i < nodes.length; i += 1) {
      let node = nodes[i];
      /*
       * Animate the radius via the tick.
       *
       * Typically this would be performed as a transition on the SVG element itself,
       * but since this is a static force layout, we must perform it on the node.
       */
      // node.radius = node.idealradius - node.idealradius * e.alpha * 10;
      node = gravity(0.2 * e.alpha)(node);
      node = collide(0.5)(node);
      node.cx = node.x;
      node.cy = node.y;
    }
  }

  function transform(d) {
    return `translate(${d.x},${d.y})`;
  }

  const force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .on('tick', tick)
    .start();

  /**
   * Run the force layout to compute where each node should be placed,
   * then replace the loading text with the graph.
   */
  function renderGraph() {
    // Run the layout a fixed number of times.
    // The ideal number of times scales with graph complexity.
    // Of course, don't run too long—you'll hang the page!
    force.start();
    for (let i = 50; i > 0; i -= 1) force.tick();
    force.stop();

    groupedNodes.forEach((group) => {
      const underscoreAcronym = group[0].person.party.acronym.replace(/ /g, '_');

      svg.select(`#bzGroup${underscoreAcronym}`)
        .selectAll('.dot')
        .data(group)
        .enter()
        .append('circle')
        .classed('dot', true)
        .attr('id', d => `_${d.person.id}`)
        .attr('r', d => d.radius)
        .attr('transform', transform)
        .style('fill', d => `url(#BZ${d.person.gov_id})`)
        .classed(`${underscoreAcronym.toLowerCase()}-stroke`, true)
        .on('click', (d) => {
          exposeMe(d);
        })
        .on('mouseover', (d) => { // setup tooltip
          tooltipdiv.transition()
            .duration(200)
            .style('opacity', 0.9);

          const tooltipLeft = (d3.event.pageX - (tooltipdiv.node().getBoundingClientRect().width / 2)) - ($('#vocabulary-chart').offset().left + 10);
          const tooltipTop = (d3.event.pageY - $('#vocabulary-chart').offset().top) - 30;

          tooltipdiv.html(`${d.person.name} | ${d.score}`)
            .style('left', (`${tooltipLeft}px`))
            .style('top', (`${tooltipTop}px`));
        })
        .on('mouseout', () => {
          tooltipdiv.transition()
            .duration(200)
            .style('opacity', 0);
        });

      makeSwitchEvent(group[0].person.party.acronym);
    });

    // handle state
    window.setTimeout(() => {
      if (vocabsize_state.people && vocabsize_state.parties) {
        if (vocabsize_state.people.length > 0) {
          // vocabsize_state.people.forEach((person_i) => {
          //   exposeMe(svg.select('#_' + String(vocabsize_state.people[i].id).datum()));
          // });
        }

        if (vocabsize_state.parties.length > 0) {
          vocabsize_state.parties.forEach((party) => {
            if (party === 'desus') {
              $('#besedni-zaklad-partyswitch-DeSUS').click();
            } else {
              const underscoreAcronym = party.replace(/-/g, '_').toUpperCase();
              $(`#besedni-zaklad-partyswitch-${underscoreAcronym}`).click();
            }
          });
        }
      }
    }, 1000);
  }

  if (!isMSIE) {
    // TODO refactor opacity code -> single redraw function -> also needs updatePeopleScroller()
    // tooltip start

    const defs = svg.append('defs').attr('id', 'thedefs');

    nodes.forEach((node, i) => {
      defs.append('pattern')
        .attr('id', `BZ${node.person.gov_id}`)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', 30)
        .attr('height', 30)
        .attr('x', -15)
        .attr('y', -15)
        .append('image')
        .attr('xlink:href', `https://cdn.parlameter.si/v1/parlassets/img/people/square/${data[i].person.gov_id}.png`)
        .attr('width', 30)
        .attr('height', 30)
        .attr('x', 0)
        .attr('y', 0);
    });

    window.setTimeout(() => {
      renderGraph();
    }, 1000);

    $('.besedni-zaklad-person-close').on('click', (event) => {
      event.stopPropagation();

      $(event.currentTarget).parent().addClass('hidden');
      const d3PersonId = $(event.currentTarget).parent().data('id');
      const d3Person = svg.select(`#_${d3PersonId}`);
      d3Person.classed('selected', false);

      if ($('.dot.selected').length === 0) {
        $('#vocabulary-chart').removeClass('selection-active');
      }

      addSearchPerson(d3Person.datum().person.name, d3Person.datum().person.id);

      // if all party members are hidden, disable partyswitch
      const partyElemendId = $(event.currentTarget).parent().data('id');
      const partyacronym = svg.select(`#_${partyElemendId}`).datum().person.party.acronym.replace(/ /g, '_');

      if (svg.selectAll(`.${partyacronym.toLowerCase()}-stroke.selected`)[0].length === 0) {
        const hoverclassname = `${partyacronym.toLowerCase()}-hover`;
        const backgroundclassname = `${partyacronym.toLowerCase()}-background`;
        $(`#besedni-zaklad-partyswitch-${partyacronym}`)
          .removeClass('turnedon');
        // $(`#besedni-zaklad-partyswitch-${partyacronym}`)
        //   .addClass(hoverclassname);
        $(`#besedni-zaklad-partyswitch-${partyacronym}`)
          .removeClass(backgroundclassname);
      }

      updatePeopleScroller();
    });
    $('.besedni-zaklad-person').on('click', (event) => {
      document.location.href = urlsData.base + urlsData.personLink.base + urlsData.person[$(event.currentTarget).data('id')].slug + urlsData.personLink.pregled;
    });

    updatePeopleSearch();
  } else {
    $('.card-besedni-zaklad .card-content-front').html('<div class="no-results" style="width: 300px; margin-top: -20px;">Tvoj brskalnik žal ne podpira tehnologij, ki poganjajo to kartico.</div>');
  }

  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})();
