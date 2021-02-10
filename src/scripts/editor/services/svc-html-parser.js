'use strict';

angular.module('risevision.editor.services')
  .factory('htmlParser', [

    function () {
      var factory = {};

      var UNIT_PIXEL = 'px';
      var UNIT_PERCENT = '%';

      var numbers = '0123456789.-';

      if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function (str) {
          return this.slice(0, str.length) === str;
        };
      }

      if (typeof String.prototype.endsWith !== 'function') {
        String.prototype.endsWith = function (str) {
          return this.slice(-str.length) === str;
        };
      }

      if (typeof String.prototype.equalsIgnoreCase !== 'function') {
        String.prototype.equalsIgnoreCase = function (str) {
          return this.toUpperCase() === str.toUpperCase();
        };
      }

      factory.getUnitString = function (value, unit) {
        var decimalPoints = 0;

        if (UNIT_PERCENT === unit) {
          decimalPoints = 5;
        }

        return value.toFixed(decimalPoints) + unit;
      };


      var _toTokensString = function (tokens, divider) {
        var result = '';
        for (var i = 0; i < tokens.length; i++) {
          if (tokens[i]) {
            result += tokens[i] + divider;
          }
        }
        return result;
      };

      factory.updateStyle = function (param, value, styleToken) {
        var tokens = styleToken.split(';');
        var found = false;
        for (var x = 0; x < tokens.length; x++) {
          if (tokens[x].indexOf(':') !== -1) {
            if (tokens[x].substring(0, tokens[x].indexOf(':')).trim()
              .equalsIgnoreCase(param)) {
              tokens[x] = param + ':' + value;
              found = true;
              break;
            }
          }
        }

        if (!found) {
          return _toTokensString(tokens, ';') + param + ':' + value + ';';
        }

        return _toTokensString(tokens, ';');
      };

      factory.removeStyle = function (param, styleToken) {
        var tokens = styleToken.split(';');
        for (var x = 0; x < tokens.length; x++) {
          if (tokens[x].indexOf(':') !== -1) {
            if (tokens[x].substring(0, tokens[x].indexOf(':')).trim()
              .equalsIgnoreCase(param)) {
              tokens[x] = '';
              break;
            }
          }
        }

        return _toTokensString(tokens, ';');
      };

      factory.getNextQuote = function (htmlString) {
        var quote;
        if (htmlString.indexOf('"') !== -1 &&
          (htmlString.indexOf('\'') === -1 ||
            htmlString.indexOf('"') < htmlString.indexOf('\''))) {
          quote = '"';
        } else {
          quote = '\'';
        }

        return quote;
      };

      factory.getPropertyValue = function (htmlString, property) {
        var start, end;

        start = htmlString.indexOf(property);
        if (start !== -1) {
          var quote = factory.getNextQuote(htmlString.substring(start));

          start = htmlString.indexOf(quote, start) + 1;
          end = htmlString.indexOf(quote, start);

          if (end !== -1) {
            return htmlString.substring(start, end);
          }
        }

        return '';
      };

      factory.stripGarbage = function (s) {
        var bad = '"\' ';
        var result = '';
        for (var i = 0; i < s.length; i++) {
          if (bad.indexOf(s.charAt(i)) === -1) {
            result += s.charAt(i);
          }
        }

        return result;
      };

      factory.getUnits = function (token) {
        var result = '';
        token = factory.stripGarbage(token);

        for (var i = 0; i < token.length; i++) {
          if (numbers.indexOf(token.charAt(i)) === -1) {
            result += token.charAt(i);
          }
        }

        return result;
      };

      var _getNumber = function (token) {
        var resultString = '';

        token = factory.stripGarbage(token);

        for (var i = 0; i < token.length; i++) {
          if (numbers.indexOf(token.charAt(i)) !== -1) {
            resultString += token.charAt(i);
          } else {
            break;
          }
        }

        return resultString;
      };

      factory.getFloatValue = function (token) {
        if (typeof token === 'number') {
          return token;
        }
        var result = -1;
        var resultString = _getNumber(token);

        result = parseFloat(resultString);

        return !result || isNaN(result) ? 0 : result;
      };

      factory.getIntValue = function (token) {
        if (typeof token === 'number') {
          return token;
        }
        var result = -1;
        var resultString = _getNumber(token);

        result = parseInt(resultString);

        return !result || isNaN(result) ? 0 : result;
      };

      factory.parseIntProperty = function (object, property, defaultValue) {
        if (object.hasOwnProperty(property)) {
          object[property] = object[property] ?
            factory.getIntValue(object[property]) :
            (defaultValue ? defaultValue : 0);
        }
      };

      factory.getBooleanValue = function (value) {
        if (typeof value === 'boolean') {
          return value;
        } else {
          return value === 'true';
        }
      };

      factory.parseBooleanProperty = function (object, property) {
        if (object.hasOwnProperty(property)) {
          object[property] = factory.getBooleanValue(object[property]);
        }
      };

      factory.stripOuterGarbage = function (s) {
        s = s.trim();
        if (s.startsWith('\'')) {
          s = s.substring(1, s.length);
        }
        if (s.endsWith('\'')) {
          s = s.substring(0, s.length - 1);
        }
        if (s.startsWith('"')) {
          s = s.substring(1, s.length);
        }
        if (s.endsWith('"')) {
          s = s.substring(0, s.length - 1);
        }
        return s.trim();
      };

      factory.updateInnerString = function (htmlString, start, end, token) {
        return htmlString.substring(0, start) + token +
          htmlString.substring(end, htmlString.length);
      };

      return factory;
    }
  ]);
