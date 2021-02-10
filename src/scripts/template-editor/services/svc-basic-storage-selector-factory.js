'use strict';

angular.module('risevision.template-editor.services')
  .service('basicStorageSelectorFactory', [
    function () {
      var factory = {
        isListView: true
      };

      return factory;
    }
  ]);
