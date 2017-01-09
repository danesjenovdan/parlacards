/* global $ seznamPoslancevState seznamPoslancevData seznamPoslancevColumns makeEmbedSwitch
activateCopyButton addCardRippling */

(() => {
  const personListElement = $('.card-seznam-poslancev .person-list');
  const headersElement = personListElement.find('.headers');
  let personElements = personListElement.children('.person');
  const infoTextElement = $('.card-seznam-poslancev .card-content-info .card-back-content');
  let currentSortProperty = 'name';
  let currentReverseOrder = false;
  const sortPropGetters = {
    name: item => item.person.name,
    party: item => item.person.party.acronym,
    district: item => item.person.formattedDistrict,
    analysis: item => item.results[seznamPoslancevState.analysis],
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
    personElements.sort((a, b) => {
      const an = propGetter(seznamPoslancevData.data[a.getAttribute('data-index')]);
      const bn = propGetter(seznamPoslancevData.data[b.getAttribute('data-index')]);

      if (an > bn) {
        return 1;
      } else if (an < bn) {
        return -1;
      }
      return 0;
    });

    personElements.detach();

    if (reverseOrder) {
      personElements = $(personElements.get().reverse());
    }

    personElements.appendTo(personListElement);
  }

  function getInfoText(sortProperty) {
    function getDistrictNames(ids) {
      return seznamPoslancevData.districts
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

    // return `${firstLine}<br><br>${secondLine}${thirdLine ? `<br><br>${thirdLine}` : ''}`;
    return `<p class="info-text lead">${firstLine} ${secondLine}</p>${thirdLine ? `<p class="info-text heading">METODOLOGIJA</p><p class="info-text">${thirdLine}</p>` : ''}`;
  }

  function updateInfoText(sortProperty) {
    infoTextElement.html(getInfoText(sortProperty));
  }

  headersElement.on('click', '.column', (event) => {
    const headerElement = $(event.currentTarget);
    const sortProperty = headerElement.data('sort');
    const reverseOrder = currentSortProperty === sortProperty && !currentReverseOrder;

    updateInfoText(sortProperty);
    sortBy(sortPropGetters[sortProperty], reverseOrder);
    toggleClasses(headerElement, sortProperty, currentSortProperty);

    currentSortProperty = sortProperty;
    currentReverseOrder = reverseOrder;
  });

  updateInfoText('name');
  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})();
