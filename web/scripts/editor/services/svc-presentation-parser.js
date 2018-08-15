'use strict';

angular.module('risevision.editor.services')
  .constant('PRESENTATION_JSON_FIELDS', [
    'id', 'hidePointer', 'donePlaceholder', 'embeddedIds'
  ])
  .constant('SUPPORTED_PLACEHOLDER_ITEMS', [
    'widget', 'presentation'
  ])
  .constant('PLACEHOLDER_JSON_FIELDS', [
    'id', 'type', 'timeDefined', 'startDate',
    'endDate', 'startTime', 'endTime',
    'recurrenceType', 'recurrenceFrequency',
    'recurrenceAbsolute', 'recurrenceDayOfWeek',
    'recurrenceDaysOfWeek',
    'recurrenceDayOfMonth', 'recurrenceWeekOfMonth',
    'recurrenceMonthOfYear', 'visibility',
    'transition', 'items', 'distributeToAll'
  ])
  .constant('PLAYLIST_ITEM_JSON_FIELDS', [
    'name', 'duration', 'type', 'objectReference',
    'index', 'playUntilDone', 'objectData',
    'additionalParams', 'timeDefined',
    'startDate', 'endDate',
    'startTime', 'endTime',
    'recurrenceType', 'recurrenceFrequency',
    'recurrenceAbsolute', 'recurrenceDayOfWeek',
    'recurrenceDaysOfWeek',
    'recurrenceDayOfMonth', 'recurrenceWeekOfMonth',
    'recurrenceMonthOfYear', 'settingsUrl'
  ])
  .factory('presentationParser', ['$log', 'htmlParser', 'pick',
    'PRESENTATION_JSON_FIELDS', 'PLACEHOLDER_JSON_FIELDS',
    'PLAYLIST_ITEM_JSON_FIELDS', 'SUPPORTED_PLACEHOLDER_ITEMS',
    function ($log, htmlParser, pick, PRESENTATION_JSON_FIELDS,
      PLACEHOLDER_JSON_FIELDS, PLAYLIST_ITEM_JSON_FIELDS,
      SUPPORTED_PLACEHOLDER_ITEMS) {
      var factory = {};

      var htmlTag = '<html';
      var htmlEndTag = '</html>';
      var headStartTag = '<head';
      var headEndTag = '</head>';
      var linkTag = '<link';
      var scriptStartTag = '<script';
      var scriptEndTag = '</script>';
      var bodyTag = '<body';
      var bodyEndTag = '</body>';

      var divTag = '<div';
      var divEndTag = '</div>';

      var dataVariableParam = 'presentationdata';
      var dataVariableString = '' +
        '<script language="javascript">\n' +
        '\t<!--\n' +
        '\tvar presentationData = %data%;\n' +
        '\t//-->\n' +
        '\t</script>';

      var relParam = ' rel=';
      var relHelpLinkParam = 'help';
      var hrefParam = ' href=';

      var idParam = ' id=';
      var placeholderParam = ' placeholder=';
      //	var urlParam = ' src=';
      var styleParam = ' style=';
      var widthParam = 'width';
      var heightParam = 'height';
      var topParam = 'top';
      var leftParam = 'left';
      var zIndexParam = 'z-index';
      var backgroundParam = 'background';
      var backgroundSizeParam = 'background-size';
      var backgroundScaleValue = 'contain';
      //	var overflowParam = 'overflow';

      var idPrefix = 'ph';

      // AD - overflow:hidden removed
      //	var nativeStyleString = 'position:absolute;overflow:hidden;';
      var nativeStyleString = 'position:absolute;';

      var HIDE_SCRIPT = '<script>try {' +
        'setVisible("%s1", false);' +
        '} catch(err) { parent.writeToLog("setVisible call - %s1 - " + err.message); }' +
        '</script>';


      factory.parseHelpLink = function (htmlString) {
        var start, end;

        start = htmlString.toLowerCase().indexOf(linkTag);
        while (start !== -1) {
          // search for the end of the tag
          end = htmlString.indexOf('>', start);

          if (relHelpLinkParam === htmlParser.stripGarbage(htmlParser.getPropertyValue(
              htmlString.substring(start, end + 1), relParam)).toLowerCase()) {
            return htmlParser.stripGarbage(htmlParser.getPropertyValue(
              htmlString.substring(start, end + 1), hrefParam));
          }

          start = htmlString.toLowerCase().indexOf(linkTag, end);
        }

        return '';
      };

      factory.parseBodyStyle = function (presentation, htmlString) {
        var tokens = htmlString.split(';');
        for (var x = 0; x < tokens.length; x++) {
          if (tokens[x].indexOf(':') !== -1) {
            var param = tokens[x].split(':')[0];
            var value = tokens[x].substring(tokens[x].indexOf(':') + 1).trim();

            if (param.equalsIgnoreCase(widthParam)) {
              presentation.width = htmlParser.getIntValue(value);
              presentation.widthUnits = htmlParser.getUnits(value);
            } else if (param.equalsIgnoreCase(heightParam)) {
              presentation.height = htmlParser.getIntValue(value);
              presentation.heightUnits = htmlParser.getUnits(value);
            } else if (param.equalsIgnoreCase(backgroundParam)) {
              presentation.backgroundStyle = value;
            } else if (param.equalsIgnoreCase(backgroundSizeParam)) {
              presentation.backgroundScaleToFit = value ===
                backgroundScaleValue;
            }
          }
        }
      };

      var _cleanPlaceholderData = function (placeholders) {
        var items, j;
        for (var i = 0; i < placeholders.length; i++) {
          htmlParser.parseBooleanProperty(placeholders[i],
            'recurrenceAbsolute');
          htmlParser.parseBooleanProperty(placeholders[i], 'timeDefined');
          htmlParser.parseBooleanProperty(placeholders[i], 'visibility');

          htmlParser.parseIntProperty(placeholders[i],
            'recurrenceDayOfMonth');
          htmlParser.parseIntProperty(placeholders[i],
            'recurrenceDayOfWeek');
          htmlParser.parseIntProperty(placeholders[i],
            'recurrenceFrequency');
          htmlParser.parseIntProperty(placeholders[i],
            'recurrenceMonthOfYear');
          htmlParser.parseIntProperty(placeholders[i],
            'recurrenceWeekOfMonth');

          if (placeholders[i].items) {
            items = placeholders[i].items;
            for (j = 0; j < items.length; j++) {
              if (SUPPORTED_PLACEHOLDER_ITEMS.indexOf(items[j].type) === -1) {
                factory.hasLegacyItems = true;
              }
              htmlParser.parseBooleanProperty(items[j], 'playUntilDone');
              htmlParser.parseBooleanProperty(items[j],
                'recurrenceAbsolute');
              htmlParser.parseBooleanProperty(items[j], 'timeDefined');

              htmlParser.parseIntProperty(items[j], 'duration', 10);
              htmlParser.parseIntProperty(items[j], 'index');

              htmlParser.parseIntProperty(items[j], 'recurrenceDayOfMonth');
              htmlParser.parseIntProperty(items[j], 'recurrenceDayOfWeek');
              htmlParser.parseIntProperty(items[j], 'recurrenceFrequency');
              htmlParser.parseIntProperty(items[j], 'recurrenceMonthOfYear');
              htmlParser.parseIntProperty(items[j], 'recurrenceWeekOfMonth');
            }
          }
        }
      };

      var _processLayout = function (htmlString) {
        var start, end;

        start = htmlString.toLowerCase().indexOf(dataVariableParam);

        if (start !== -1) {
          // find if the next character is a quote or a bracket
          if (htmlString.indexOf('\'', start) === -1 ||
            htmlString.indexOf('{', start) < htmlString.indexOf('\'', start)
          ) {
            start = htmlString.indexOf('{', start);

            end = htmlString.lastIndexOf('};');

            // increment end only if end string was found
            if (end !== -1) {
              // do not include the ;
              end = end + 1;
            }
          } else {
            var quote = htmlParser.getNextQuote(htmlString.substring(start));

            start = htmlString.indexOf(quote, start) + 1;
            end = htmlString.indexOf(quote, start);
            while (end !== -1 && htmlString.charAt(end - 1) === '\\') {
              end = htmlString.indexOf(quote, end + 1);
            }
          }

          if (end !== -1) {
            var json = htmlString.substring(start, end);
            var dataObject = null;

            json = json.replace('\\\'', '\'');

            try {
              dataObject = JSON.parse(json);
            } catch (err) {
              console.error('parse presentation error', err);
              return {
                valid: false
              };
            }

            return {
              valid: true,
              dataObject: dataObject && dataObject.presentationData
            };
          }
        }

        return {
          valid: true
        };
      };

      factory.validatePresentation = function (presentation) {
        return _processLayout(presentation.layout).valid;
      };

      factory.parsePresentationData = function (presentation) {
        var start, end;
        var layout = _processLayout(presentation.layout);

        if (layout.valid && layout.dataObject) {
          var dataObject = layout.dataObject;

          presentation.hidePointer =
            htmlParser.getBooleanValue(dataObject.hidePointer);
          presentation.donePlaceholder = dataObject.donePlaceholder;

          _cleanPlaceholderData(dataObject.placeholders);

          presentation.placeholders = dataObject.placeholders;
        }

        return layout.valid;
      };

      factory.parseStyle = function (placeholder, htmlString) {
        var tokens = htmlString.split(';');
        for (var x = 0; x < tokens.length; x++) {
          if (tokens[x].indexOf(':') !== -1) {
            var param = tokens[x].split(':')[0].trim();
            var value = tokens[x].substring(tokens[x].indexOf(':') + 1).trim();

            if (param.equalsIgnoreCase(widthParam)) {
              placeholder.width = htmlParser.getFloatValue(value);
              placeholder.widthUnits = htmlParser.getUnits(value);
            } else if (param.equalsIgnoreCase(heightParam)) {
              placeholder.height = htmlParser.getFloatValue(value);
              placeholder.heightUnits = htmlParser.getUnits(value);
            } else if (param.equalsIgnoreCase(topParam)) {
              placeholder.top = htmlParser.getFloatValue(value);
              placeholder.topUnits = htmlParser.getUnits(value);
            } else if (param.equalsIgnoreCase(leftParam)) {
              placeholder.left = htmlParser.getFloatValue(value);
              placeholder.leftUnits = htmlParser.getUnits(value);
            } else if (param.equalsIgnoreCase(zIndexParam)) {
              placeholder.zIndex = htmlParser.getIntValue(value);
            } else if (param.equalsIgnoreCase(backgroundParam)) {
              placeholder.backgroundStyle = value;
            } else if (param.equalsIgnoreCase(backgroundSizeParam)) {
              placeholder.backgroundScaleToFit = value ===
                backgroundScaleValue;
            }
          }
        }
      };

      factory.parseDiv = function (htmlString) {
        var placeholder = null;

        var id = htmlParser.getPropertyValue(htmlString, idParam);
        if (id && htmlParser.getPropertyValue(htmlString, placeholderParam)) {
          placeholder = {};

          placeholder.id = id;

          factory.parseStyle(placeholder, htmlParser.stripOuterGarbage(
            htmlParser.getPropertyValue(htmlString, styleParam)));
        }
        return placeholder;
      };

      var _removeDeletedPlaceholders = function (placeholders) {
        // remove deleted placeholders from the list
        for (var i = 0; i < placeholders.length; i++) {
          if (placeholders[i].deleted) {
            placeholders.splice(i, 1);
            i--;
          }
        }
      };

      factory.parsePlaceholders = function (presentation, htmlString) {
        var start, end;
        var found, i, j;
        presentation.placeholders = presentation.placeholders || [];
        var placeholders = presentation.placeholders;
        var newPlaceholders = [];

        start = htmlString.indexOf(divTag);
        while (start !== -1) {
          // search for the end of the div
          end = htmlString.indexOf('>', start);

          var placeholder = factory.parseDiv(htmlString.substring(start,
            end + 1));

          if (placeholder) {
            newPlaceholders.push(placeholder);
          }

          start = htmlString.indexOf(divTag, end);
        }

        var listChanged = false;
        for (i = 0; i < placeholders.length; i++) {
          found = false;
          for (j = 0; j < newPlaceholders.length; j++) {
            if (newPlaceholders[j].id === placeholders[i].id) {
              found = true;
              break;
            }
          }
          if (!found) {
            listChanged = true;
            placeholders[i].deleted = true;
          }
        }

        _removeDeletedPlaceholders(placeholders);

        for (j = 0; j < newPlaceholders.length; j++) {
          found = false;
          for (i = 0; i < placeholders.length; i++) {
            if (newPlaceholders[j].id === placeholders[i].id) {
              found = true;
              placeholders[i].width = newPlaceholders[j].width;
              placeholders[i].widthUnits = newPlaceholders[j].widthUnits;
              placeholders[i].height = newPlaceholders[j].height;
              placeholders[i].heightUnits = newPlaceholders[j].heightUnits;
              placeholders[i].left = newPlaceholders[j].left;
              placeholders[i].leftUnits = newPlaceholders[j].leftUnits;
              placeholders[i].top = newPlaceholders[j].top;
              placeholders[i].topUnits = newPlaceholders[j].topUnits;
              placeholders[i].zIndex = newPlaceholders[j].zIndex;
              placeholders[i].backgroundStyle = newPlaceholders[j].backgroundStyle;
              placeholders[i].backgroundScaleToFit = newPlaceholders[j].backgroundScaleToFit;
            }
          }

          if (!found) {
            listChanged = true;
            placeholders.push(newPlaceholders[j]);
          }
        }

        return listChanged;
      };

      factory.parsePresentation = function (presentation) {
        var start, end;
        var htmlString = presentation.layout;

        factory.hasLegacyItems = false;

        if (!htmlString) {
          return true;
        }

        start = htmlString.toLowerCase().indexOf(htmlTag);
        end = htmlString.toLowerCase().indexOf(htmlEndTag, start);
        if (start === -1 || end === -1) {
          return true;
        }

        // process head for help link
        start = htmlString.toLowerCase().indexOf(headStartTag, start);
        end = htmlString.toLowerCase().indexOf(headEndTag, start);

        if (start === -1 || end < start) {
          return true;
        }

        presentation.helpURL = factory.parseHelpLink(htmlString.substring(
          start, end + 1));

        // process body next
        start = htmlString.toLowerCase().indexOf(bodyTag, start);
        end = htmlString.indexOf('>', start);

        if (start === -1 || end < start) {
          return true;
        }

        factory.parseBodyStyle(presentation, htmlParser.stripOuterGarbage(
          htmlParser.getPropertyValue(htmlString.substring(start, end +
            1), styleParam)));

        end = htmlString.toLowerCase().indexOf(bodyEndTag, start);
        if (start === -1 || end === -1) {
          return true;
        }

        // process data
        if (!factory.parsePresentationData(presentation)) {
          return false;
        }

        factory.parsePlaceholders(presentation, htmlString.substring(
          start, end + bodyEndTag.length));

        $log.debug('parse presentation result', presentation);

        return true;
      };

      // ======================================================================
      // Update Presentation functionality beings:


      factory.setPlaceholderId = function (placeholder, placeholders) {
        for (var i = 0; i < placeholders.length; i++) {
          var found = false;
          for (var j = 0; j < placeholders.length; j++) {
            if (placeholders[j] !== placeholder && !placeholders[j].deleted &&
              placeholders[j].id === (idPrefix + i)) {
              found = true;
              break;
            }
          }
          if (!found) {
            placeholder.id = idPrefix + i;
            break;
          }
        }

      };

      factory.findPlaceholder = function (htmlString, id) {
        var start = -1;

        start = htmlString.indexOf('"' + id + '"');
        if (start === -1) {
          start = htmlString.indexOf('\'' + id + '\'');
        }

        if (start !== -1) {
          start++;
        }

        return start;
      };

      factory.updateDiv = function (placeholder, htmlString) {
        var start = 0,
          end = 0;
        var idString, styleString;
        var found = false;

        idString = htmlParser.getPropertyValue(htmlString, idParam);
        if (idString) {
          start = htmlString.indexOf(idString);
          end = start + idString.length;

          // now is the time to re-name the placeholder (if needed); and reset newId variable
          if (placeholder.newId) {
            placeholder.id = placeholder.newId;
            placeholder.newId = undefined;
          }
          htmlString = htmlString.substring(0, start) + placeholder.id +
            htmlString.substring(end, htmlString.length);
        } else {
          htmlString += idParam + '"' + placeholder.id + '"';
        }

        if (!htmlParser.getPropertyValue(htmlString, placeholderParam)) {
          htmlString += placeholderParam + '"true"';
        }

        styleString = htmlParser.getPropertyValue(htmlString, styleParam);
        if (styleString) {
          start = htmlString.indexOf(styleString);
          end = start + styleString.length;
          found = true;
        }

        if (placeholder.width) {
          styleString = htmlParser.updateStyle(widthParam, htmlParser.getUnitString(
            placeholder.width, placeholder.widthUnits), styleString);
        } else {
          styleString = htmlParser.updateStyle(widthParam, '0px',
            styleString);
        }
        if (placeholder.height) {
          styleString = htmlParser.updateStyle(heightParam, htmlParser.getUnitString(
            placeholder.height, placeholder.heightUnits), styleString);
        } else {
          styleString = htmlParser.updateStyle(heightParam, '0px',
            styleString);
        }
        if (placeholder.left) {
          styleString = htmlParser.updateStyle(leftParam, htmlParser.getUnitString(
            placeholder.left, placeholder.leftUnits), styleString);
        } else {
          styleString = htmlParser.updateStyle(leftParam, '0px',
            styleString);
        }
        if (placeholder.top) {
          styleString = htmlParser.updateStyle(topParam, htmlParser.getUnitString(
            placeholder.top, placeholder.topUnits), styleString);
        } else {
          styleString = htmlParser.updateStyle(topParam, '0px', styleString);
        }
        if (placeholder.zIndex) {
          styleString = htmlParser.updateStyle(zIndexParam, placeholder.zIndex +
            '', styleString);
        } else {
          styleString = htmlParser.updateStyle(zIndexParam, '0',
            styleString);
        }
        if (placeholder.backgroundStyle) {
          styleString = htmlParser.updateStyle(backgroundParam, placeholder
            .backgroundStyle, styleString);
        } else {
          styleString = htmlParser.removeStyle(backgroundParam,
            styleString);
        }
        if (placeholder.backgroundStyle && placeholder.backgroundScaleToFit) {
          styleString = htmlParser.updateStyle(backgroundSizeParam,
            backgroundScaleValue, styleString);
        } else {
          styleString = htmlParser.removeStyle(backgroundSizeParam,
            styleString);
        }

        if (found) {
          htmlString = htmlParser.updateInnerString(htmlString, start, end,
            styleString);
        } else {
          htmlString += styleParam + '"' + styleString + nativeStyleString +
            '"';
        }

        return htmlString;
      };

      factory.updatePlaceholders = function (placeholders, htmlString) {
        var start, end;
        var placeholder;

        for (var i = 0; i < placeholders.length; i++) {
          placeholder = placeholders[i];
          if (!placeholder.id) {
            if (!placeholder.deleted) {
              factory.setPlaceholderId(placeholder, placeholders);
            }
            start = -1;
          } else {
            start = factory.findPlaceholder(htmlString, placeholder.id);
          }

          if (start !== -1) {
            start = htmlString.lastIndexOf('<', start);

            if (!placeholder.deleted) {
              start += divTag.length;
              end = htmlString.indexOf('>', start);

              var newDiv = factory.updateDiv(placeholder, htmlString.substring(
                start, end));

              htmlString = htmlParser.updateInnerString(htmlString, start,
                end, newDiv);
            } else {
              end = htmlString.indexOf('>', start);
              var nextTag = htmlString.indexOf(divTag, end);
              end = htmlString.indexOf(divEndTag, end);

              if (end !== -1 && (nextTag === -1 || end < nextTag)) {
                end += divEndTag.length;
                htmlString = htmlString.substring(0, start).trim() +
                  htmlString.substring(end, htmlString.length).trim();
              }

              placeholder.id = '';
            }
          } else if (!placeholder.deleted) {
            var newTag = '' + divTag + '' +
              factory.updateDiv(placeholder, '') + '>' + divEndTag + '\n\t';
            end = htmlString.indexOf(bodyEndTag);
            htmlString = htmlString.substring(0, end) + newTag +
              htmlString.substring(end);
          }
        }

        _removeDeletedPlaceholders(placeholders);

        return htmlString;
      };

      factory.updatePresentationObject = function (htmlString,
        modifiedDataVariableString) {
        var start, end = -1;

        start = htmlString.toLowerCase().indexOf(dataVariableParam);
        if (start === -1) {
          end = htmlString.indexOf(htmlEndTag);
          start = end;

          // Add spacing for the data variable
          modifiedDataVariableString = '' +
            '\n<!-- Warning - Editing the Presentation Data Object incorrectly may result in the Presentation not functioning correctly -->' +
            '\n\t' + modifiedDataVariableString + '' +
            '\n<!-- No scripts after this point -->' +
            '\n';
        } else {
          if (htmlString.indexOf('\'', start) === -1 || htmlString.indexOf(
              '{', start) < htmlString.indexOf('\'', start)) {
            start = htmlString.indexOf('{', start);

            end = htmlString.lastIndexOf('};');

            // increment end only if end string was found
            if (end !== -1) {
              end = end + 2;
            }
          } else {
            var quote = htmlParser.getNextQuote(htmlString.substring(
              start));

            start = htmlString.indexOf(quote, start);
            end = htmlString.indexOf(quote, start + 1);
            while (end !== -1 && htmlString.charAt(end - 1) === '\\') {
              end = htmlString.indexOf(quote, end + 1);
            }
            end++;
          }

          if (end !== -1) {
            start = htmlString.lastIndexOf(scriptStartTag, start);
            end = htmlString.lastIndexOf(scriptEndTag) + scriptEndTag.length;
          }
        }

        if (start !== -1 && end !== -1) {
          htmlString = htmlParser.updateInnerString(htmlString, start, end,
            modifiedDataVariableString);
        }

        return htmlString;
      };

      factory.updatePresentationData = function (presentation, htmlString) {
        var data = pick.apply(this, [presentation].concat(
          PRESENTATION_JSON_FIELDS));

        data.placeholders = [];
        for (var i = 0; i < presentation.placeholders.length; i++) {
          data.placeholders.push(pick.apply(this, [presentation.placeholders[
            i]].concat(PLACEHOLDER_JSON_FIELDS)));

          data.placeholders[i].items = [];
          for (var j = 0; presentation.placeholders[i].items &&
            j < presentation.placeholders[i].items.length; j++) {

            data.placeholders[i].items.push(pick.apply(this, [presentation.placeholders[
              i].items[j]].concat(PLAYLIST_ITEM_JSON_FIELDS)));
          }
        }

        data = {
          presentationData: data
        };

        var presentationDataString = JSON.stringify(data, null, '\t').replace(
          /&quot;/g, '\\\\\\"');

        var modifiedDataVariableString = dataVariableString.replace(
          '%data%', presentationDataString);

        return factory.updatePresentationObject(htmlString,
          modifiedDataVariableString);
      };

      factory.updatePresentation = function (presentation) {
        var start, end;

        // process presentation header first
        factory.updatePresentationHeader(presentation);

        var htmlString = presentation.layout;

        // process body
        start = htmlString.toLowerCase().indexOf(bodyTag, start);
        end = htmlString.toLowerCase().indexOf(bodyEndTag, start);
        if (start === -1 || end === -1) {
          return;
        }

        end += bodyEndTag.length;

        var newPlaceholders = factory.updatePlaceholders(presentation.placeholders,
          htmlString.substring(start, end));

        htmlString = htmlParser.updateInnerString(htmlString, start, end,
          newPlaceholders);

        presentation.layout = factory.updatePresentationData(
          presentation, htmlString);

        $log.debug('update presentation result', presentation);
      };

      // =======================================================================
      // Update presentation header functionality begins:

      factory.updateBodyTag = function (presentation, htmlString) {
        var start = 0,
          end = 0;
        var styleString;
        var found = false;

        styleString = htmlParser.getPropertyValue(htmlString, styleParam);
        if (styleString !== '') {
          start = htmlString.indexOf(styleString);
          end = start + styleString.length;
          found = true;
        }

        styleString = htmlParser.updateStyle(widthParam, presentation.width +
          presentation.widthUnits, styleString);
        styleString = htmlParser.updateStyle(heightParam, presentation.height +
          presentation.heightUnits, styleString);

        if (presentation.backgroundStyle) {
          styleString = htmlParser.updateStyle(backgroundParam,
            presentation.backgroundStyle, styleString);
        } else {
          styleString = htmlParser.removeStyle(backgroundParam,
            styleString);
        }
        if (presentation.backgroundStyle && presentation.backgroundScaleToFit) {
          styleString = htmlParser.updateStyle(backgroundSizeParam,
            backgroundScaleValue, styleString);
        } else {
          styleString = htmlParser.removeStyle(backgroundSizeParam,
            styleString);
        }

        if (found) {
          htmlString = htmlParser.updateInnerString(htmlString, start, end,
            styleString);
        } else {
          htmlString += styleParam + '"' + styleString + '"';
        }

        return htmlString;
      };

      factory.updatePresentationHeader = function (presentation) {
        var start, end;
        var htmlString = presentation.layout;

        if (!htmlString) {
          return;
        }

        start = htmlString.toLowerCase().indexOf(htmlTag);
        end = htmlString.toLowerCase().indexOf(htmlEndTag, start);
        if (start === -1 || end === -1) {
          return;
        }

        // process body first
        start = htmlString.toLowerCase().indexOf(bodyTag, start);
        end = htmlString.indexOf('>', start);

        if (start === -1 || end < start) {
          return;
        }

        var newBody = factory.updateBodyTag(presentation, htmlString.substring(
          start, end));
        htmlString = htmlParser.updateInnerString(htmlString, start, end,
          newBody);

        presentation.layout = htmlString;

        $log.debug('update presentation header result', presentation);
      };


      return factory;
    }
  ]);
