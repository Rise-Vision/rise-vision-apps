'use strict';

angular.module('risevision.apps.purchase')
  .filter('cardDescription', [

    function () {
      var _capitalizeFirstLetter = function(string) {
        if (!string) {
          return '';
        }

        return string.charAt(0).toUpperCase() + string.slice(1);
      };

      return function (card) {
        if (!card) {
          return '';
        }

        var brand = _capitalizeFirstLetter(card.brand) || 'Credit Card';
        var last4 = card.last4 || '****';

        return brand + ' ending in ' + last4;
      };
    }
  ]);
