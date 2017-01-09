/* global $ seznamPoslancevState seznamSejData seznamPoslancevColumns makeEmbedSwitch
activateCopyButton addCardRippling */

(() => {
  const personListElement = $('.card-seznam-sej .session-list');
  const headersElement = personListElement.find('.headers');
  let sessionElements = personListElement.children('.item');
  // const infoTextElement = $('.card-seznam-sej .info-text');
  let currentSortProperty = 'date';
  let currentReverseOrder = true;
  const sortPropGetters = {
    name: item => item.name,
    date: item => item.date_ts,
    updated: item => item.updated_at_ts,
    workingBody: item => item.org.name,
  };

  function toggleClasses(element, newSortProperty, oldSortProperty) {
    if (newSortProperty === oldSortProperty) {
      element.toggleClass('reverse');
    } else {
      headersElement.find('.sort, .reverse').removeClass('sort reverse');
      element.addClass('sort');
    }
  }

  function sortBy(propGetter, reverseOrder) {
    sessionElements.sort((a, b) => {
      const an = propGetter(seznamSejData.sessions[a.getAttribute('data-index')]);
      const bn = propGetter(seznamSejData.sessions[b.getAttribute('data-index')]);

      if (an > bn) {
        return 1;
      } else if (an < bn) {
        return -1;
      }
      return 0;
    });

    sessionElements.detach();

    if (reverseOrder) {
      sessionElements = $(sessionElements.get().reverse());
    }

    sessionElements.appendTo(personListElement);
  }

  /*
  function getInfoText(sortProperty) {
    function getDistrictNames(ids) {
      return seznamSejData.districts
        .filter(district => ids.indexOf(String(Object.keys(district)[0])) > -1)
        .map(district => district[String(Object.keys(district)[0])]);
    }

    const parties = seznamPoslancevState.parties ? `poslanska skupina: ${seznamPoslancevState.parties.join(', ')}` : 'vse poslanske skupine';
    const districts = seznamPoslancevState.districts ? `volilni okraj: ${getDistrictNames(seznamPoslancevState.districts).join(', ')}` : 'vsi volilni okraji';
    const presiding = seznamPoslancevState.excludePresiding ? '; brez predsedujočih poslancev' : '';
    const firstLine = `Množica vseh trenutno aktivnih poslancev, ki ustrezajo uporabniškemu vnosu (${parties}; ${districts + presiding}).`;

    const sortMap = {
      name: 'abecedi',
      district: 'okrajih',
      party: 'poslanskih skupinah',
      analysis: `rezultatu analize${seznamPoslancevState && seznamPoslancevState.analysis ? seznamPoslancevColumns[seznamPoslancevState.analysis].label : ''}`,
    };

    const secondLine = `Seznam je sortiran po ${sortMap[sortProperty]}.`;
    let thirdLine;
    if (seznamPoslancevState && seznamPoslancevState.analysis) {
      thirdLine = seznamPoslancevColumns[seznamPoslancevState.analysis].explanation;
    }

    return `${firstLine}<br><br>${secondLine}${thirdLine ? `<br><br>${thirdLine}` : ''}`;
  }

  function updateInfoText(sortProperty) {
    infoTextElement.html(getInfoText(sortProperty));
  }
  */

  headersElement.on('click', '.column', (event) => {
    const headerElement = $(event.currentTarget);
    const sortProperty = headerElement.data('sort');
    const reverseOrder = currentSortProperty === sortProperty && !currentReverseOrder;

    // updateInfoText(sortProperty);
    sortBy(sortPropGetters[sortProperty], reverseOrder);
    toggleClasses(headerElement, sortProperty, currentSortProperty);

    currentSortProperty = sortProperty;
    currentReverseOrder = reverseOrder;
  });

  // updateInfoText('name');
  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})();
