'use strict';

angular.module('risevision.apps.purchase')
  .filter('countryName', ['COUNTRIES',
    function (COUNTRIES) {
      return function (countryCode) {
        var name = countryCode;
        for (var i = 0; i < COUNTRIES.length; i++) {
          if (COUNTRIES[i].code === countryCode) {
            name = COUNTRIES[i].name;

            break;
          }
        }
        return name;
      };
    }
  ]);
