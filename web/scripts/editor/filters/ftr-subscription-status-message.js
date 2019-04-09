'use strict';

angular.module('risevision.editor.filters')
  .filter('subscriptionStatusMessage', ['$filter',
    function ($filter) {
      return function (gadget) {
        var _getRemainingDays = function (date) {
          var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
          var today = new Date();
          return Math.round(Math.abs((date.getTime() - today.getTime()) / (
            oneDay)));
        };

        var _getMessage = function () {
          var statusMessage = gadget.subscriptionStatus;
          if (gadget.isLicensed) {
            statusMessage = $filter('translate')
              ('editor-app.subscription.status.professional');
          } else if (gadget.subscriptionStatus === 'Not Subscribed' && gadget.trialPeriod > 0) {
            statusMessage = statusMessage + ' - ' + gadget.trialPeriod +
              ' ' + $filter('translate')('editor-app.subscription.status.daysTrial');
          } else if (gadget.subscriptionStatus === 'On Trial') {
            statusMessage = statusMessage +
              ' - ' + _getRemainingDays(new Date(gadget.expiry)) +
              ' ' + $filter('translate')('editor-app.subscription.status.daysRemaining');
          }
          return statusMessage;
        };
        
        return _getMessage();
      };
    }
  ]);
