'use strict';

angular.module('risevision.apps.purchase')
  .filter('cardDescription', [

    function () {
      var _convertSnakeCase = function(string) {
        return string.replace(/[\W_]+/g, ' ');
      };

      var _toTitleCase = function(string) {
        return string.replace(/(^|\s)\S/g, function(t) { return t.toUpperCase() });
      };

      return function (card) {
        if (!card) {
          return '';
        }

        var brand = card.brand || '';
        brand = _convertSnakeCase(brand);
        brand = _toTitleCase(brand) || 'Credit Card';
        var last4 = card.last4 || '****';

        return brand + ' ending in ' + last4;
      };
    }
  ]);
