'use strict';

angular.module('risevision.displays.services')
  .factory('displaySummaryFactory', ['display', 'processErrorCode',
    function (display, processErrorCode) {
      var factory = {
        summary: undefined
      };

      factory.loadSummary = function () {
        factory.summary = undefined;
        factory.summaryLoading = true;

        return display.summary()
          .then(function (summary) {
            factory.summary = summary;
          })
          .catch(function (err) {
            factory.apiError = processErrorCode(err);
            console.log('Error requesting display summary', err);
          })
          .finally(function(){
            factory.summaryLoading = false;
          });
      };

      return factory;
    }
  ]);
