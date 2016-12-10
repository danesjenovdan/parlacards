(function() {
  var personListElement = $('.card-seznam-poslancev .person-list'),
      headersElement = personListElement.find('.headers')
      personElements = personListElement.children('.person'),
      infoTextElement = $('.card-seznam-poslancev .info-text'),
      currentSortProperty = 'name',
      currentReverseOrder = false,
      sortPropGetters = {
        name: function(item) { return item.person.name },
        party: function(item) { return item.person.party.acronym },
        district: function(item) { return item.person.formattedDistrict },
        analysis: function(item) { return item.results[seznamPoslancevState.analysis] },
      };

  headersElement.on('click', '.column', function(event) {
    var headerElement = $(event.currentTarget),
        sortProperty = headerElement.data('sort'),
        reverseOrder = currentSortProperty === sortProperty && !currentReverseOrder;

    updateInfoText(sortProperty);
    sortBy(sortPropGetters[sortProperty], reverseOrder);
    toggleClasses(headerElement, sortProperty, currentSortProperty);

    currentSortProperty = sortProperty;
    currentReverseOrder = reverseOrder;
  });

  function toggleClasses(element, newSortProperty, oldSortProperty) {
    if (newSortProperty === oldSortProperty) {
      element.toggleClass('reverse');
    }
    else {
      headersElement.find('.sort, .reverse').removeClass('sort reverse');
      element.addClass('sort')
    }
  }

  function sortBy(propGetter, reverseOrder) {
    personElements.sort(function(a,b) {
      var an = propGetter(seznamPoslancevData.data[a.getAttribute('data-index')]),
          bn = propGetter(seznamPoslancevData.data[b.getAttribute('data-index')]);

      return an > bn ? 1 : (an < bn ? -1 : 0)
    });

    personElements.detach()

    if (reverseOrder) {
      personElements = $(personElements.get().reverse());
    }

    personElements.appendTo(personListElement);
  }

  function updateInfoText(sortProperty) {
    infoTextElement.html(getInfoText(sortProperty));
  }

  function getInfoText(sortProperty) {
    function getDistrictNames(ids) {
      return seznamPoslancevData.districts
        .filter(function(district) {
          return ids.indexOf(String(Object.keys(district)[0])) > -1;
        })
        .map(function(district) {
          return district[String(Object.keys(district)[0])];
        });
    }

    var parties = seznamPoslancevState.parties ? 'poslanska skupina: ' + seznamPoslancevState.parties.join(', ') : 'vse poslanske skupine';
    var districts = seznamPoslancevState.districts ? 'volilni okraj: ' + getDistrictNames(seznamPoslancevState.districts).join(', ') : 'vsi volilni okraji';
    var presiding = seznamPoslancevState.excludePresiding ? '; brez predsedujočih poslancev' : '';
    var firstLine = 'Množica vseh trenutno aktivnih poslancev, ki ustrezajo uporabniškemu vnosu (' + parties + '; ' + districts + presiding + ').';

    var sortMap = {
      name: 'abecedi',
      district: 'okrajih',
      party: 'poslanskih skupinah',
      analysis: 'rezultatu analize ' + (seznamPoslancevState && seznamPoslancevState.analysis ? seznamPoslancevColumns[seznamPoslancevState.analysis].label : '')
    };

    var secondLine = 'Seznam je sortiran po ' + sortMap[sortProperty] + '.';

    var thirdLine = seznamPoslancevState && seznamPoslancevState.analysis ? seznamPoslancevColumns[seznamPoslancevState.analysis].explanation : null;

    return firstLine + '<br><br>' + secondLine + (thirdLine ? '<br><br>' + thirdLine : '');
  };

  updateInfoText('name');
  makeEmbedSwitch();
  activateCopyButton();
  addCardRippling();
})();
