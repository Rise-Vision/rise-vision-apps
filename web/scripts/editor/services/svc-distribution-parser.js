'use strict';

angular.module('risevision.editor.services')
  .factory('distributionParser', ['htmlParser',

    function (htmlParser) {
      var factory = {};

      var _parseDistribution = function (placeholders, distributionList) {
        var j, placeholder;

        for (var i = 0; i < distributionList.length; i++) {
          var id = distributionList[i].itemId;

          if (id) {
            var tokens = id.split('#');
            var displaysList = distributionList[i].displayIds;

            if (tokens.length > 0) {
              var placeholderId = tokens[0];

              for (j = 0; j < placeholders.length; j++) {
                placeholder = placeholders[j];

                if (placeholder.id === placeholderId) {
                  if (tokens.length === 1) {
                    placeholder.distribution = displaysList;
                    placeholder.distributeToAll = false;
                  } else {
                    var itemNumber = htmlParser.getIntValue(tokens[1]);
                    if (itemNumber !== -1 &&
                      itemNumber < placeholder.items.length) {
                      placeholder.items[itemNumber].distribution =
                        displaysList;
                      placeholder.items[itemNumber].distributeToAll = false;
                    }
                  }
                  break;
                }
              }
            }
          }
        }
      };

      factory.parseDistribution = function (presentation) {
        if (presentation.placeholders && presentation.distribution) {
          _parseDistribution(presentation.placeholders,
            presentation.distribution);
        }
      };

      factory.updateDistribution = function (presentation) {
        var j, placeholder;
        presentation.distribution = [];
        if (presentation.placeholders) {
          for (var i = 0; i < presentation.placeholders.length; i++) {
            placeholder = presentation.placeholders[i];
            if (placeholder.distributeToAll === false) {
              presentation.distribution.push({
                itemId: placeholder.id,
                displayIds: placeholder.distribution || []
              });
            }

            if (placeholder.items) {
              for (j = 0; j < placeholder.items.length; j++) {
                var id = placeholder.id + '#' + j;
                if (placeholder.items[j].distributeToAll === false) {
                  presentation.distribution.push({
                    itemId: id,
                    displayIds: placeholder.items[j].distribution || []
                  });
                }
              }
            }
          }
        }

      };

      return factory;
    }
  ]);
