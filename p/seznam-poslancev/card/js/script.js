(function() {
  var personListElement = $('.card-seznam-poslancev .person-list'),
      headersElement = personListElement.find('.headers')
      personElements = personListElement.children('.person'),
      currentSortProperty = 'name',
      currentReverseOrder = false,
      sortPropGetters = {
        name: function(item) { return item.person.name },
        party: function(item) { return item.person.party.acronym },
        district: function(item) { return item.person.formattedDistrict },
        analysis: function(item) { return item.results[seznamPoslancevStatus.analysis] },
      };

  headersElement.on('click', '.column', function(event) {
    var headerElement = $(event.currentTarget),
        sortProperty = headerElement.data('sort'),
        reverseOrder = currentSortProperty === sortProperty && !currentReverseOrder;

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
})();
