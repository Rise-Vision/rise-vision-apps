'use strict';

angular.module('risevision.editor.services')
  .value('TEMPLATE_LIBRARY_PRODUCT_CODE', '61dd6aa64152a228522ddf5950e5abb526416f27')
  .factory('checkTemplateAccess', ['subscriptionStatusFactory', 'TEMPLATE_LIBRARY_PRODUCT_CODE',
    function (subscriptionStatusFactory, TEMPLATE_LIBRARY_PRODUCT_CODE) {
      return function (templateCode) {
        return subscriptionStatusFactory.check(TEMPLATE_LIBRARY_PRODUCT_CODE)
          .catch(function () {
            return subscriptionStatusFactory.check(templateCode);
          });
      };
    }
  ]);
