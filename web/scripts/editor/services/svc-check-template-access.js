'use strict';

angular.module('risevision.editor.services')
  .value('TEMPLATE_LIBRARY_PRODUCT_CODE', '61dd6aa64152a228522ddf5950e5abb526416f27')
  .factory('checkTemplateAccess', ['storeAuthorization', 'TEMPLATE_LIBRARY_PRODUCT_CODE',
    function (storeAuthorization, TEMPLATE_LIBRARY_PRODUCT_CODE) {
      return function (templateCode) {
        return storeAuthorization.check(TEMPLATE_LIBRARY_PRODUCT_CODE)
          .catch(function () {
            return storeAuthorization.check(templateCode);
          });
      };
    }
  ]);
