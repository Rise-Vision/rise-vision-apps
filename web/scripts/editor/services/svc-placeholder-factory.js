'use strict';

angular.module('risevision.editor.services')
  .factory('placeholderFactory', ['$rootScope',
    function ($rootScope) {
      var factory = {};

      factory.setPlaceholder = function (placeholder) {
        factory.placeholder = placeholder;
      };

      factory.clearPlaceholder = function () {
        factory.placeholder = undefined;
      };

      $rootScope.$on('$stateChangeSuccess', function (event, toState) {
        if (toState !== 'apps.editor.workspace.artboard') {
          factory.clearPlaceholder();
        }
      });

      $rootScope.$on('presentationUpdated', function (event, toState) {
        factory.clearPlaceholder();
      });

      return factory;
    }
  ]);
