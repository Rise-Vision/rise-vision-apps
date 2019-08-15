'use strict';

angular.module('risevision.template-editor.services')
  .factory('blueprintFactory', ['$http', 'BLUEPRINT_URL',
    function ($http, BLUEPRINT_URL) {
      var factory = {};

      factory.load = function (productCode) {
        var url = BLUEPRINT_URL.replace('PRODUCT_CODE', productCode);

        return $http.get(url)
          .then(function (blueprintData) {
            factory.blueprintData = blueprintData.data;

            return factory.blueprintData;
          });
      };

      return factory;
    }
  ]);
