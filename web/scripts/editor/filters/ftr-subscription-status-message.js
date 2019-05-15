'use strict';

angular.module('risevision.editor.filters')
  .filter('subscriptionStatusMessage', ['$filter',
    function ($filter) {
      return function (gadget) {
        var _getMessage = function () {
          if (gadget.isSubscribed && !gadget.isLicensed) {
            return gadget.subscriptionStatus;
          } else {
            return $filter('translate')('editor-app.subscription.status.professional');
          }
        };

        return _getMessage();
      };
    }
  ]);
